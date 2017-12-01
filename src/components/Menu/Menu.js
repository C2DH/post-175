import React, { PureComponent } from 'react'
import { TransitionMotion, spring } from 'react-motion'
import { connect } from 'react-redux'
import { closeMenu } from '../../state/actions'
import { getMenuOpen } from '../../state/selectors'
import MenuOpen from './MenuOpen'

class Menu extends PureComponent {

  // Leave menu in a cool way
  menuWillLeave = () => {
    return { offset: spring(-100) }
  }

  menuWillEnter = () => {
    return { offset: -100 }
  }

  getStyles = () => {
    if (!this.props.open) {
      return []
    }

    return [
      {
        key: 'menu',
        style: { offset: spring(0) }
      }
    ]
  }

  getDefaultStyles = () => {
    if (!this.props.open) {
      return []
    }

    return [
      {
        key: 'menu',
        style: { offset: -100 }
      }
    ]
  }

  render() {
    return (
      <TransitionMotion
        defaultStyles={this.getDefaultStyles()}
        styles={this.getStyles()}
        willLeave={this.menuWillLeave}
        willEnter={this.menuWillEnter}
      >
        {interpolatedStyles =>
          <div>
            {interpolatedStyles.map(config => (
              <MenuOpen
                key={config.key}
                style={{ transform: `translateX(${config.style.offset}%)` }}
                onRequestClose={this.props.closeMenu}
              />
          ))}
          </div>
        }
      </TransitionMotion>
    )
  }
}

const mapStateToPros = state => ({
  open: getMenuOpen(state),
})

export default connect(mapStateToPros, {
  closeMenu,
})(Menu)
