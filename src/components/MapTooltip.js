import React, { PureComponent } from 'react'
import { get } from 'lodash'
import { connect } from 'react-redux'
import { clearOverPlace } from '../state/actions'

export default class MapTooltip extends PureComponent {
  render() {
    const { place, style } = this.props
    return (
      <div style={{...style}}
        className='d-flex flex-row'
        >
        <div className="cover"
          style={{background: `url(${get(place, 'documents[0].snapshot')}) no-repeat`, width: 100}}
        />
        <div className="h-100 bg-black p-2">
          {place.open
            ? <p className="m-0 font-12" style={{color: '#13d436'}}>Open</p>
            : <p className="m-0 font-12" style={{color: '#fdd00c'}}>Closed</p>}
          <p style={{fontSize: 18, color: '#d4d4d4', margin: 0}}>{place.title}</p>
          <div className="w-100 d-inline-flex flex-1">
            <div className="h-100" style={{paddingTop: 2, paddingRight: 3}}>
              <i className="material-icons font-12 text-grey">place</i>
            </div>
            <div className="h-100">
              <span className="font-14 text-grey">{place.data.address}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
