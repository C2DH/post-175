import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import ReactMapboxGl, { Marker } from 'react-mapbox-gl'
import Legend from '../components/Legend'
import {
  loadPlaces,
  unloadPlaces,
} from '../state/actions'
import {
  getPlacesInDate,
} from '../state/selectors'
import TimelineNavigationMap from '../components/TimelineNavigationMap'

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
  }

  render() {
    const { center, zoom } = this.state
    const { places } = this.props

    return (
      <div className="h-100vh d-flex flex-column">
        <div className='row no-gutters flex-1'>
          <Legend />
          <div className='d-flex flex-1 w-100 flex-column'>
            <Map
              style="mapbox://styles/mapbox/streets-v9"
              className="w-100 flex-1"
              keyboard={false}
              dragRotate={false}
              touchZoomRotate={false}
              center={center}
              zoom={zoom}
            >
              <div>
                {places && places.map(place => (
                  <Marker
                    key={place.id}
                    coordinates={place.coordinates}
                  >
                    <svg width={10} height={10}>
                      <circle cx={5} cy={5} r={5} fill={place.open ? '#13d436' : '#fdd00c'} />
                    </svg>
                  </Marker>
                ))}
              </div>
            </Map>
            {places && <TimelineNavigationMap />}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  places: getPlacesInDate(state),
})
export default connect(mapStateToProps, {
  loadPlaces,
  unloadPlaces,
})(MapPage)
