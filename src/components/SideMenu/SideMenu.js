import React, { PureComponent } from 'react'
import { TransitionMotion, spring } from 'react-motion'
import { connect } from 'react-redux'
import { closeMenu } from '../../state/actions'
import { getMenuOpen } from '../../state/selectors'

class SideMenu extends PureComponent {

  render() {
    return (
      <div className="position-fixed h-100 bg-info" style={{width: 50, zIndex: 1000}}>

      </div>
    )
  }
}

const mapStateToPros = state => ({
  open: getMenuOpen(state),
})

export default connect(mapStateToPros, {
  closeMenu,
})(SideMenu)
