import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Motion, spring, presets } from 'react-motion'
import { getMakeLangUrl } from '../state/selectors'

class Home extends PureComponent {
  render() {
    const { url } = this.props
    return (
      <div>
        <Motion defaultStyle={{ top: -60 }} style={{ top: spring(100, presets.wobbly) }}>
          {({ top }) => (
            <div style={{ textAlign: 'center', marginTop: top }}>
              <h1>HOME</h1>
              <div><Link to={url('/timeline')}>Timeline</Link></div>
              <div><Link to={url('/map')}>Map</Link></div>
              <div><Link to={url('/about')}>About</Link></div>
            </div>
          )}
        </Motion>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  url: getMakeLangUrl(state),
})
export default connect(mapStateToProps)(Home)
