import React, { PureComponent } from 'react'
import classNames from 'classnames'
import { TransitionMotion, spring } from 'react-motion'
import { connect } from 'react-redux'
import { closeMenu } from '../../state/actions'
import { getMenuOpen } from '../../state/selectors'
import './SideMenu.css'

class SideMenu extends PureComponent {
  state = {
    expaned: false,
  }

  handleMouseEnter = () => this.setState({ expaned: true })

  handleMouseLeave = () => this.setState({ expaned: false })

  render() {
    return (
      <div
        className={classNames('side-menu', {
          'expaned': this.state.expaned,
        })}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <div className='side-menu-top'>
          <div className='side-menu-link'>
            <div className='link-icon'>Ti</div>
            <div className='link-label'>Timeline</div>
          </div>
          {/* <div className='side-menu-link'>Ma</div>
          <div className='side-menu-link'>Ar</div>
          <div className='side-menu-link'>Th</div> */}
        </div>
        <div className='side-menu-bottom'>
          23
        </div>
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
