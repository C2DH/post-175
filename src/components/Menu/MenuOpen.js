import React, { PureComponent } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { localize } from '../../localize'
import { Link, withRouter } from 'react-router-dom'
import { getMakeLangUrl, getLangs, getSelectedLang} from '../../state/selectors'

class MenuOpen extends PureComponent {

  changeLang = (langParam) => {
    const { url, location } = this.props
    const currentUrl = location.pathname + location.search
    this.props.history.push(url(currentUrl, langParam))
  }

  render() {
    const { location, onRequestClose, url, langs, selectedLang, style, t } = this.props
    const { pathname } = location

    const subDict = {
      'fr_FR':'Connecter le Luxembourg',
      'de_DE':'Luxemburg verbinden'
    }

    const logos = [
      '/img/unilu.jpg',
      '/img/c2dh.jpg',
      '/img/post.png'
    ]

    return (
      <div
        style={style}
        className='position-fixed fixed-top fixed-bottom w-25 bg-black d-flex flex-column'>

        <div className='p-3'>
          <div>
            <button onClick={onRequestClose} className="btn bg-black border-0 p-0 topbar-button">
              <i className="material-icons">close</i>
            </button>
          </div>
          <Link to={url('/')} className="menu-link" onClick={onRequestClose}>
            <h1 className="display-4 text-light">175 <br /> {t('menu_joerpost')}</h1>
          </Link>

          <p className="text-grey" style={{fontSize: 18}}>{subDict[selectedLang.code]}</p>
        </div>

        <div className='flex-1 d-flex flex-column'>
          <div className='flex-1 p-3 d-flex flex-column justify-content-between'>

            <div>
              <div className='pb-2'>
                <Link to={url('/')} className="menu-link" onClick={onRequestClose}>
                  <h3 className={classNames("text-light font-weight-light", {
                    'text-underlined': pathname === '/',
                  })}>{t('menu_home')}</h3>
                </Link>
              </div>
              <div className='pb-2'>
                <Link to={url('/map')} className="menu-link" onClick={onRequestClose}>
                  <h3 className={classNames("text-light font-weight-light", {
                    'text-underlined': pathname === '/map',
                  })}>{t('menu_map')}</h3>
                </Link>
              </div>
              <div className='pb-2'>
                <Link to={url('/timeline')} className="menu-link" onClick={onRequestClose}>
                  <h3 className={classNames("text-light font-weight-light", {
                    'text-underlined': pathname === '/timeline',
                  })}>{t('menu_timeline')}</h3>
                </Link>
              </div>
              <div>
                <Link to={url('/about')} className="menu-link" onClick={onRequestClose}>
                  <h3 className={classNames("text-light font-weight-light", {
                    'text-underlined': pathname === '/about',
                  })}>{t('menu_about')}</h3>
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
          <div className="d-flex bg-white h-100px">
            {logos.map((logo,i) => (
              <div
                key={i}
                className="menu-logo-cont">
                <img className="menu-logo-img" src={logo}></img>
              </div>
            ))}
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
export default withRouter(connect(mapStateToPros)(localize()(MenuOpen)))
