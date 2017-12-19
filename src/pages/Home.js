import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import HomePics from '../components/HomePics'
import classNames from 'classnames'
import {
  loadHomeDocs,
  unloadHomeDocs,
  loadStory,
  unloadStory,
} from '../state/actions'
import {
  getHomeDocs,
  getMakeLangUrl,
  getLangs,
  getSelectedLang,
  getStory,
} from '../state/selectors'

class Home extends PureComponent {
  componentDidMount() {
    this.props.loadHomeDocs()
    this.props.loadStory('home')
  }

  componentWillUnmount() {
    this.props.unloadHomeDocs()
    this.props.unloadStory()
  }

  changeLang = (langParam) => {
    const { url, location } = this.props
    const currentUrl = location.pathname + location.search
    this.props.history.push(url(currentUrl, langParam))
  }

  render() {
    const { url, docs, langs, selectedLang, story } = this.props
    return (
      <div className="h-100 d-flex flex-column bg-black">
        <div className='row no-gutters flex-1 w-100 '>
          {docs && <HomePics docs={docs} />}
        </div>
        <div className='home-info-container row no-gutters flex-1 w-100 d-flex mb-4 p-3 bg-black flex-wrap flex-md-nowrap'>
          <div className="d-flex h-100 home-flex-1 flex-column">
            <div>
              <h1>
                175 <span style={{fontWeight: 300}}>Joer Post</span>
            </h1>
              <p className="home-subtitle">
                {story?story.data.subtitle:''}
              </p>
            </div>
            <div className="mt-auto mb-5">
              {langs.map(lang => (
                <h5
                  onClick={() => this.changeLang(lang.param)}
                  key={lang.code}
                  className={classNames("text-light font-weight-light p-0 m-0 pointer", {
                    'text-underlined': lang.code === selectedLang.code,
                  })}>
                  {lang.label}
                </h5>
              ))}
            </div>
          </div>
          <div className="d-flex home-h-100 home-flex-1 flex-column">
            <p className="lead-24">
              {story?story.data.abstract:''}
          </p>
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
  story: getStory(state),
  url: getMakeLangUrl(state),
  docs: getHomeDocs(state),
  langs: getLangs(state),
  selectedLang: getSelectedLang(state),
})
export default connect(mapStateToProps, {
  loadHomeDocs,
  unloadHomeDocs,
  loadStory,
  unloadStory,
})(Home)
