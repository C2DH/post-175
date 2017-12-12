import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Motion, spring, presets } from 'react-motion'
import { getMakeLangUrl } from '../state/selectors'
import HomePics from '../components/HomePics'

class Home extends PureComponent {
  render() {
    const { url } = this.props
    return (
      <div className="h-100vh d-flex flex-column bg-dark">
        {/* <Motion defaultStyle={{ top: -60 }} style={{ top: spring(100, presets.wobbly) }}>
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
        </Motion> */}
        <div className='row no-gutters flex-1 w-100 bg-info'>
          <HomePics/>
        </div>
        <div className='row no-gutters flex-1 w-100 d-flex p-3 bg-black'>
          <div className="d-flex h-100 flex-1">
            <h5 style={{fontSize: 28}}><b>175</b> Joer Post</h5>
          </div>
          <div className="d-flex h-100 flex-1 flex-column">
            <p className="lead-24">Cras ultricies ligula sed magna dictum porta. Sed porttitor lectus nibh.
              Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.</p>
              <a href="#" className="text-white"><u>Read more</u></a>
          </div>
          <div className="d-flex h-100 justify-content-end" style={{flex: 1.5}}>
            <div className="d-flex flex-column">
              <div className="p-3 border mb-1">
                <Link to={url('/timeline')}>
                  <span className="text-light d-flex d-inline-flex justify-content-between align-items-center w-100 lead-24">
                    <span className="ml-3">Discover the Timeline</span>
                    <i className="material-icons mr-3 ml-2">arrow_forward</i>
                  </span>
                </Link>
              </div>
              <div className="p-3 border mt-1">
                <Link to={url('/map')}>
                  <span className="text-light d-flex d-inline-flex justify-content-between align-items-center w-100 lead-24">
                    <span className="ml-3">Explore the Map</span>
                    <i className="material-icons mr-3 ml-2">arrow_forward</i>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className='row no-gutters w-100 fixed-bottom d-flex align-items-center bg-opaque-black' style={{height: 60}}>
          <p className="m-0 pl-3 font-14">A project by the Luxembourg Centre for the Contemporary and Digital History (CD2H)</p>
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  url: getMakeLangUrl(state),
})
export default connect(mapStateToProps)(Home)
