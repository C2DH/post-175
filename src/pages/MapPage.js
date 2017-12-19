import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import ReactMapGL, { NavigationControl, Marker, HTMLOverlay, Popup, FlyToInterpolator } from 'react-map-gl'
import Legend from '../components/Legend'
import {
  loadPlaces,
  unloadPlaces,
  unloadMap,
  setSelectedPlace,
  clearSelectedPlace,
  setOverPlace,
  clearOverPlace,
  loadStory,
  unloadStory,
} from '../state/actions'
import {
  getPlacesInDate,
  getMapOverPlace,
  getMapSelectedPlace,
  getMapTimelineCurrentDate,
  getStory,
} from '../state/selectors'
import TimelineNavigationMap from '../components/TimelineNavigationMap'
import MobileAlert from '../components/MobileAlert'
import MapTooltip from '../components/MapTooltip'
import { Motion, TransitionMotion, spring, presets } from 'react-motion'


// TODO: Style that bitch
const CurrentYear = ({ year }) => (
  <h1 className="map-year">{year}</h1>
)

class MapPage extends PureComponent {
  state = {
    viewport: {
      longitude: 6.087,
      latitude: 49.667,
      zoom: 8,
    },
    width: 0,
    height: 0,
  }

  componentDidMount() {
    this.props.loadStory('map')
    this.props.loadPlaces()
    this.setMapSize()
    window.addEventListener('resize', this.setMapSize, false)
  }

  setMapSize = () => {
    this.setState({width: this.mapContainer.offsetWidth, height: this.mapContainer.offsetHeight - 50})
  }

  componentWillUnmount() {
    this.props.unloadStory()
    this.props.unloadPlaces()
    this.props.unloadMap()
    window.removeEventListener('resize', this.setMapSize)
  }

  selectPlace = place => {
    this.props.setSelectedPlace(place)
    this.updateViewport({
      latitude: place.coordinates[1],
      longitude: place.coordinates[0],
      zoom: 13,
      // transitionInterpolator: new LinearInterpolator(),
      // transitionDuration: 2000
    })
  }

  closePlaceDetail = () => {
    this.props.clearSelectedPlace()
    this.updateViewport({ zoom: 11 })
  }

  updateViewport = (viewport) => {
    this.setState({
      viewport: {
        ...this.state.viewport,
        ...viewport,
      }
    })
  }

  render() {
    const { width, height, viewport } = this.state
    const {
      places,
      overPlace,
      selectedPlace,
      setSelectedPlace,
      clearSelectedPlace,
      setOverPlace,
      clearOverPlace,
      currentDate,
      story,
    } = this.props
    console.log('--->', overPlace)

    return (
      <div className="h-100 d-flex flex-column">
        <MobileAlert />
        <div className='row no-gutters flex-1'>
          <Legend
            story={story}
            selectedPlace={selectedPlace}
            onClose={this.closePlaceDetail}
          />
          <div className='d-flex flex-1 w-100 flex-column bg-darkgrey' style={{ overflow: 'hidden' }} ref={(node)=>this.mapContainer = node}>
              { width > 0 && (
                <ReactMapGL
                  transitionDuration={1000}
                  transitionInterpolator={new FlyToInterpolator()}
                  {...viewport}
                  mapboxApiAccessToken='pk.eyJ1IjoiZ2lvcmdpb3Vib2xkaSIsImEiOiJjamI4NWd1ZWUwMDFqMndvMzk1ODU3NWE2In0.3bX3jRxCi0IaHbmQTkQfDg'
                  mapStyle="mapbox://styles/giorgiouboldi/cjalcurkr00os2soczuclhjxl"
                  height={height}
                  width={width}
                  onViewportChange={this.updateViewport}
                >
                  <div style={{ position: 'absolute',right: 5, top: 5 }}>
                    <NavigationControl onViewportChange={this.updateViewport} />
                  </div>
                  {currentDate  && <CurrentYear year={currentDate.getFullYear()} />}
                  {places && places.map(place => {
                    const isSelected = selectedPlace ? place.id === selectedPlace.id : false
                    return (
                      <Marker
                        key={place.id}
                        longitude={place.coordinates[0]}
                        latitude={place.coordinates[1]}

                      >
                        <div onClick={() => this.selectPlace(place)}>
                        {!isSelected && <svg width={12} height={12}>
                          <circle
                            onMouseEnter={() => setOverPlace(place)}
                            onMouseLeave={() => clearOverPlace()}
                            stroke='black'
                            cx={6} cy={6} r={5} fill={place.open ? '#13d436' : '#fdd00c'} />
                        </svg>}
                        {isSelected && <svg width={40} height={40}>
                          <circle
                            stroke='black'
                            cx={20} cy={20} r={10} fill={place.open ? '#13d436' : '#fdd00c'} />
                          <circle
                            cx={20} cy={20} r={20} fill='transparent'
                            stroke={place.open ? '#13d436' : '#fdd00c'} />
                        </svg>}
                        </div>
                      </Marker>
                    )
                  })}

                  <TransitionMotion
                    defaultStyles={overPlace ? [{
                      key: 'popup',
                      data: { overPlace },
                      style: { o: 0 },
                    }] : []}
                    styles={overPlace ? [{
                      key: 'popup',
                      data: { overPlace },
                      style: { o: spring(1) },
                    }] : []}
                    willLeave={() => ({ o: spring(0) })}
                    willEnter={() => ({ o: 0 })}
                  >
                    {interpolatedStyles =>
                      <div>
                        {interpolatedStyles.map(config => {
                          return (
                            <div key={config.key}>
                          <HTMLOverlay redraw={()=>(
                            <div style={{ opacity: config.style.o, position: 'absolute', width:width, height:height, background:'rgba(0,0,0,.8)', pointerEvents:'none'}}/>
                          )}/>
                          <Popup latitude={config.data.overPlace.coordinates[1]} longitude={config.data.overPlace.coordinates[0]}
                            tipSize={0}
                              closeOnClick={false} anchor="bottom" closeButton={false}  offsetBottom={15}>

                              <MapTooltip
                                style={{ opacity: config.style.o }}
                                place={config.data.overPlace}
                              />
                          </Popup>
                        </div>
                        )
                      })}
                      </div>
                    }
                  </TransitionMotion>

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
  story: getStory(state),
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
  loadStory,
  unloadStory,
})(MapPage)
