import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getMakeLangUrl } from '../state/selectors'
import HomePics from '../components/HomePics'
import {
  loadHomeDocs,
  unloadHomeDocs,
} from '../state/actions'
import {
  getHomeDocs,
} from '../state/selectors'

class Home extends PureComponent {
  componentWillMount() {
    this.props.loadHomeDocs()
  }

  componentWillUnmount() {
    this.props.unloadHomeDocs()
  }

  render() {
    const { url, docs } = this.props
    return (
      <div className="h-100 d-flex flex-column bg-black">
        <div className='row no-gutters flex-1 w-100 '>
          {docs && <HomePics docs={docs} />}
        </div>
        <div className='row no-gutters flex-1 w-100 d-flex p-3 bg-black'>
          <div className="d-flex h-100 flex-1">
            <h5 style={{fontSize: 28}}>175 <span style={{fontWeight: 300}}>Joer Post</span></h5>
          </div>
          <div className="d-flex h-100 flex-1 flex-column">
            <p className="lead-24">Cras ultricies ligula sed magna dictum porta. Sed porttitor lectus nibh.
              Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.</p>
            <Link to={url('/about')} className="text-white">Read more</Link>
          </div>
          <div className="d-flex h-100 justify-content-end" style={{flex: 1.5}}>
            <div className="d-flex flex-column">
              <div className="home-button p-3 border mb-1">
                <Link to={url('/timeline')}>
                  <span className="text-light d-flex d-inline-flex justify-content-between align-items-center w-100 lead-24">
                    <span className="ml-3">Discover the Timeline</span>
                    <i className="material-icons mr-3 ml-2">arrow_forward</i>
                  </span>
                </Link>
              </div>
              <div className="home-button p-3 border mt-1">
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
  docs: getHomeDocs(state),
})
export default connect(mapStateToProps, {
  loadHomeDocs,
  unloadHomeDocs,
})(Home)
