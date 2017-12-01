import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { openMenu } from '../state/actions'

class TopBar extends PureComponent {
  render() {
    const { title, openMenu } = this.props
    return (
      <div className='w-100 bg-dark text-light d-flex'>

        <div className='d-flex'>
          <button className='btn' onClick={openMenu}>-</button>
          <h3>{title}</h3>
        </div>
      </div>
    )
  }
}

export default connect(undefined, {
  openMenu,
})(TopBar)
