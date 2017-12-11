import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { clearOverPlace } from '../state/actions'

class MapTooltip extends PureComponent {
  render() {
    const { place, onClick } = this.props
    return (
      <div style={{width: 250, height:350, cursor: 'pointer' }}
        className='bg-warning d-flex flex-column'
        onClick={onClick}
        onMouseLeave={() => this.props.clearOverPlace()}
        >
        <div className="w-100 cover bg-info" style={{background: `url(${place.img}) no-repeat`, flex: 2.5}}/>
        <div className="w-100 bg-black p-2">
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

export default connect(undefined, {
  clearOverPlace,
})(MapTooltip)
