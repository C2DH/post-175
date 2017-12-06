import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl'
import Legend from '../components/Legend'
import {
  loadPlaces,
  unloadPlaces,
} from '../state/actions'
import {
  getPlaces,
} from '../state/selectors'
import TimelineNavigationMap from '../components/TimelineNavigationMap'

const Map = ReactMapboxGl({
  accessToken: 'pk.eyJ1IjoiZWlzY2h0ZXdlbHRrcmljaCIsImEiOiJjajRpYnR1enEwNjV2MndtcXNweDR5OXkzIn0._eSF2Gek8g-JuTGBpw7aXw'
})

class MapPage extends PureComponent {
  componentDidMount() {
    this.props.loadPlaces()
  }

  componentWillUnmount() {
    this.props.unloadPlaces()
  }

  render() {
    const { places } = this.props
    return (
      <div className="h-100vh d-flex flex-column">
        <div className='row no-gutters flex-1'>
          <Legend />
          <div className='d-flex flex-1 w-100 flex-column'>
            <Map
              style="mapbox://styles/mapbox/streets-v9"
              className="w-100 flex-1"
            />
            {places && <TimelineNavigationMap />}
            {/* <div style={{ height: 50 }} className='bg-dark w-100'></div> */}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  places: getPlaces(state),
})
export default connect(mapStateToProps, {
  loadPlaces,
  unloadPlaces,
})(MapPage)
