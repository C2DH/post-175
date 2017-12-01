import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { Motion, spring, presets } from 'react-motion'

class Home extends PureComponent {
  render() {
    return (
      <div>
        <Motion defaultStyle={{ top: -60 }} style={{ top: spring(100, presets.wobbly) }}>
          {({ top }) => (
            <div style={{ textAlign: 'center', marginTop: top }}>
              <h1>HOME</h1>
              <div><Link to='/timeline'>Timeline</Link></div>
              <div><Link to='/map'>Map</Link></div>
              <div><Link to='/about'>About</Link></div>
            </div>
          )}
        </Motion>
      </div>
    )
  }
}

export default Home
