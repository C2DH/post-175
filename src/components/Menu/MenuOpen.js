import React, { PureComponent } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { getMakeLangUrl, getLangs, getSelectedLang } from '../../state/selectors'

class MenuOpen extends PureComponent {

  changeLang = (langParam) => {
    const { url, location } = this.props
    const currentUrl = location.pathname + location.search
    this.props.history.push(url(currentUrl, langParam))
  }

  render() {
    const { location, onRequestClose, url, langs, selectedLang, style } = this.props
    const { pathname } = location

    return (
      <div
        style={style}
        className='position-fixed fixed-top fixed-bottom w-25 bg-black d-flex flex-column'>

        <div className='p-3'>
          <div>
            <button onClick={onRequestClose} className="btn bg-black border-0">
              <i className="material-icons">close</i>
            </button>
          </div>
          <Link to={url('/')} onClick={onRequestClose}><h1 className="display-4 text-light">175 <br /> Joer Post</h1></Link>

          <p className="text-grey" style={{fontSize: 18}}>A long history of comunication, technologies, services and people.</p>
        </div>

        <div className='flex-1 d-flex flex-column'>
          <div className='flex-1 p-3 d-flex flex-column justify-content-between'>

            <div>
              <div className='pb-2'>
                <Link to={url('/')} onClick={onRequestClose}>
                  <h3 className={classNames("text-light font-weight-light", {
                    'text-underlined': pathname === '/',
                  })}>Home</h3>
                </Link>
              </div>
              <div className='pb-2'>
                <Link to={url('/map')} onClick={onRequestClose}>
                  <h3 className={classNames("text-light font-weight-light", {
                    'text-underlined': pathname === '/map',
                  })}>Map</h3>
                </Link>
              </div>
              <div className='pb-2'>
                <Link to={url('/timeline')} onClick={onRequestClose}>
                  <h3 className={classNames("text-light font-weight-light", {
                    'text-underlined': pathname === '/timeline',
                  })}>Timeline</h3>
                </Link>
              </div>
              <div>
                <Link to={url('/about')} onClick={onRequestClose}>
                  <h3 className={classNames("text-light font-weight-light", {
                    'text-underlined': pathname === '/about',
                  })}>About</h3>
                </Link>
              </div>
            </div>

            <div>
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
          <div className="bg-light h-100px">
            {/* Logos partners */}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToPros = state => ({
  url: getMakeLangUrl(state),
  langs: getLangs(state),
  selectedLang: getSelectedLang(state),
})
export default withRouter(connect(mapStateToPros)(MenuOpen))
