import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import ReactMapGL, { Marker, HTMLOverlay, Popup } from 'react-map-gl'
import Legend from '../components/Legend'
import {
  loadPlaces,
  unloadPlaces,
  unloadMap,
  setSelectedPlace,
  clearSelectedPlace,
  setOverPlace,
  clearOverPlace,
} from '../state/actions'
import {
  getPlacesInDate,
  getMapOverPlace,
  getMapSelectedPlace,
  getMapTimelineCurrentDate,
} from '../state/selectors'
import TimelineNavigationMap from '../components/TimelineNavigationMap'
import MapTooltip from '../components/MapTooltip'


// TODO: Style that bitch
const CurrentYear = ({ year }) => (
  <h1 style={{ position: 'absolute', top: 0 }}>{year}</h1>
)

class MapPage extends PureComponent {
  state = {
    center: [6.087, 49.667],
    zoom: [8],
    width: 0,
    height: 0,
  }

  componentDidMount() {
    this.props.loadPlaces()
    this.setState({width: this.mapContainer.offsetWidth, height: this.mapContainer.offsetHeight - 50})
  }

  componentWillUnmount() {
    this.props.unloadPlaces()
    this.props.unloadMap()
  }

  selectPlace = place => {
    this.props.setSelectedPlace(place)
    this.setState({
      center: place.coordinates,
      zoom: [13],
    })
  }

  closePlaceDetail = () => {
    this.props.clearSelectedPlace()
    this.setState({
      zoom: [11],
    })
  }

  render() {
    const { center, zoom, width, height } = this.state
    const {
      places,
      overPlace,
      selectedPlace,
      setSelectedPlace,
      clearSelectedPlace,
      setOverPlace,
      clearOverPlace,
      currentDate,
    } = this.props

    return (
      <div className="h-100vh d-flex flex-column">
        <div className='row no-gutters flex-1'>
          <Legend
            selectedPlace={selectedPlace}
            onClose={this.closePlaceDetail}
          />
          <div className='d-flex flex-1 w-100 flex-column' ref={(node)=>this.mapContainer = node}>

              { width > 0 && (
                <ReactMapGL
                  mapboxApiAccessToken='pk.eyJ1IjoiZWlzY2h0ZXdlbHRrcmljaCIsImEiOiJjajRpYnR1enEwNjV2MndtcXNweDR5OXkzIn0._eSF2Gek8g-JuTGBpw7aXw'
                  mapStyle="mapbox://styles/mapbox/streets-v9"
                  className="w-100 flex-1"
                  height={height}
                  width={width}
                  latitude={center[1]}
                  longitude={center[0]}
                  zoom={zoom[0]}
                  onViewportChange={(viewport) => {
                    const {width, height, latitude, longitude, zoom} = viewport;
                    this.setState({center:[longitude, latitude], zoom:[zoom]})
                  }}
                >

                  {currentDate  && <CurrentYear year={currentDate.getFullYear()} />}
                  {places && places.map(place => {
                    const isSelected = selectedPlace ? place.id === selectedPlace.id : false
                    // FIXME: Not intended as a solution '-.- only a way to test selected shit
                    // highlighted...
                    const mul = isSelected ? 2 : 1
                    return (
                      <Marker
                        key={place.id}
                        longitude={place.coordinates[0]}
                        latitude={place.coordinates[1]}
                      >
                        <div>
                        <svg width={10 * mul} height={10 * mul}>
                          <circle
                            onMouseEnter={() => setOverPlace(place)}
                            cx={5 * mul} cy={5 * mul} r={5 * mul} fill={place.open ? '#13d436' : '#fdd00c'} />
                        </svg>
                        </div>
                      </Marker>
                    )
                  })}

                  { overPlace &&
                    <HTMLOverlay redraw={()=>(
                      <div style={{position: 'absolute', width:width, height:height, background:'rgba(0,0,0,.8)', pointerEvents:'none'}}/>
                    )}/>
                  }


                  { overPlace &&
                    <Popup latitude={overPlace.coordinates[1]} longitude={overPlace.coordinates[0]}
                        closeOnClick={false} anchor="top" closeButton={false}  offsetTop={-15}>
                      <MapTooltip place={overPlace} onClick={() => this.selectPlace(overPlace)} />
                    </Popup>
                  }



                </ReactMapGL>

              )}

            {places && <TimelineNavigationMap />}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  places: getPlacesInDate(state),
  overPlace: getMapOverPlace(state),
  selectedPlace: getMapSelectedPlace(state),
  currentDate: getMapTimelineCurrentDate(state),
})
export default connect(mapStateToProps, {
  loadPlaces,
  unloadPlaces,
  unloadMap,
  setSelectedPlace,
  clearSelectedPlace,
  setOverPlace,
  clearOverPlace,
})(MapPage)
