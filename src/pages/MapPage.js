import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import ReactMapboxGl, { Marker, Popup, ZoomControl } from 'react-mapbox-gl'
import classNames from 'classnames'
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

// TODO: Style that bitch
const MapTooltip = ({ place }) => (
  <div>{place.title}</div>
)

// TODO: Style that bitch
const CurrentYear = ({ year }) => (
  <h1 style={{ position: 'absolute', top: 0 }}>{year}</h1>
)

const Map = ReactMapboxGl({
  accessToken: 'pk.eyJ1IjoiZWlzY2h0ZXdlbHRrcmljaCIsImEiOiJjajRpYnR1enEwNjV2MndtcXNweDR5OXkzIn0._eSF2Gek8g-JuTGBpw7aXw'
})

class MapPage extends PureComponent {
  state = {
    center: [6.087, 49.667],
    zoom: [8],
  }

  componentDidMount() {
    this.props.loadPlaces()
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
    const { center, zoom } = this.state
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
          <div className='d-flex flex-1 w-100 flex-column'>
            <div className={classNames('d-flex w-100 flex-1', { 'map-with-over-place': overPlace !== null })}>
              <Map
                style="mapbox://styles/mapbox/streets-v9"
                className="w-100 flex-1"
                keyboard={false}
                dragRotate={false}
                touchZoomRotate={false}
                center={center}
                zoom={zoom}
              >
                {currentDate  && <CurrentYear year={currentDate.getFullYear()} />}
                <ZoomControl position="top-right" />
                {places && places.map(place => {
                  const isSelected = selectedPlace ? place.id === selectedPlace.id : false
                  // FIXME: Not intended as a solution '-.- only a way to test selected shit
                  // highlighted...
                  const mul = isSelected ? 2 : 1
                  return (
                    <Marker
                      key={place.id}
                      coordinates={place.coordinates}
                      onClick={() => this.selectPlace(place)}
                    >
                      <svg
                        width={10 * mul}
                        height={10 * mul}
                        onMouseEnter={() => setOverPlace(place)}
                        onMouseOut={clearOverPlace}>
                        <circle cx={5 * mul} cy={5 * mul} r={5 * mul} fill={place.open ? '#13d436' : '#fdd00c'} />
                      </svg>
                    </Marker>
                  )
                })}
                {overPlace && (
                  <Popup
                    coordinates={overPlace.coordinates}
                    offset={{ bottom: [0, -15] }}
                    anchor='bottom'>
                    <MapTooltip place={overPlace} />
                  </Popup>
                )}
              </Map>
            </div>
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
