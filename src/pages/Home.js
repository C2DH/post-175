import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { Motion, spring, presets } from 'react-motion'

class Home extends PureComponent {
  render() {
    return (
      <div>
        <div className='p-2'>
          <Link to='/about'>About</Link>
          <button className='btn btn-primary'>BUTTON</button>
        </div>
        <Motion defaultStyle={{ top: -60 }} style={{ top: spring(100, presets.wobbly) }}>
          {({ top }) => (
            <div style={{ textAlign: 'center', marginTop: top }}>
              <h1>Home</h1>
            </div>
          )}
        </Motion>
      </div>
    )
  }
}

export default Home
