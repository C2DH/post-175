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
            <div style={{ marginTop: top }} className="pl-3">
              <h1 className="display-3">175 Joer Post</h1>
              <h3>A long history of communication,<br />technologies, services and people</h3>
              <div className="d-inline-flex">
                <div className="mr-2 p-2 border"><Link to={url('/timeline')}>Discover the Timeline -></Link></div>
                <div className="ml-2 p-2 border"><Link to={url('/map')}>Explore the Map -></Link></div>
              </div>
              <div className="mt-3"><Link to={url('/about')}>About</Link></div>
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
