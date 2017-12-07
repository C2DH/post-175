import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { getMapTimelineCurrentDate } from '../state/selectors'


class MapTooltip extends PureComponent {
  render() {
    const { place, currentDate } = this.props
    return (
      <div style={{width: 250}}>
        <div className="map-tooltip cover bg-info" style={{background: `url(${place.img}) no-repeat`}}/>
        <div className="w-100 bg-black p-2">
          {place.open
            ? <p className="m-0 font-12" style={{color: '#13d436'}}>Open</p>
            : <p className="m-0 font-12" style={{color: '#fdd00c'}}>Closed</p>}
          <p style={{fontSize: 18, color: '#d4d4d4', margin: 0}}>{place.title}</p>
          <div className="w-100 d-inline-flex">
            <div className="h-100" style={{paddingTop: 2, paddingRight: 3}}>
              <i className="material-icons font-12" style={{color: '#9b9b9b'}}>place</i>
            </div>
            <div className="h-100">
              <span style={{color: '#9b9b9b', fontSize: 14}}>{place.data.address}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default MapTooltip
