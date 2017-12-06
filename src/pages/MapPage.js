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

  render() {
    const { center, zoom } = this.state
    const {
      places,
      overPlace,
      selectedPlace,
      setSelectedPlace,
      setOverPlace,
      clearOverPlace,
    } = this.props

    return (
      <div className="h-100vh d-flex flex-column">
        <div className='row no-gutters flex-1'>
          <Legend
            selectedPlace={selectedPlace}
            onClose={clearSelectedPlace}
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
                <CurrentYear year={2017} />
                <ZoomControl position="top-right" />
                {places && places.map(place => (
                  <Marker
                    key={place.id}
                    coordinates={place.coordinates}
                    onClick={() => setSelectedPlace(place)}
                  >
                    <svg
                      width={10}
                      height={10}
                      onMouseEnter={() => setOverPlace(place)}
                      onMouseOut={clearOverPlace}>
                      <circle cx={5} cy={5} r={5} fill={place.open ? '#13d436' : '#fdd00c'} />
                    </svg>
                  </Marker>
                ))}
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
