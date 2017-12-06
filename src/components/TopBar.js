import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { openMenu } from '../state/actions'

class TopBar extends PureComponent {
  render() {
    const { title, openMenu } = this.props
    return (
      <div className='w-100 bg-opaque-black d-flex' style={{height: 57}}>
        <div className='d-flex'>
          <button className='btn bg-opaque-black pt-2' onClick={openMenu}>
            <i className="material-icons pt-1">menu</i>
          </button>
          <h6 className="pb-0 mb-0 align-self-center">{title}</h6>
        </div>
      </div>
    )
  }
}

export default connect(undefined, {
  openMenu,
})(TopBar)
