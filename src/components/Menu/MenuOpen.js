import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { getMakeLangUrl, getLangs, getSelectedLang } from '../../state/selectors'

class MenuOpen extends PureComponent {

  changeLang = (langParam) => {
    const { pathname } = this.props.location
    const splitter = pathname.split('/')
    const commonPathname = splitter.length > 1 ? splitter.slice(2).join('/') : ''
    const newPathname = `/${langParam}/` + commonPathname
    this.props.history.push(newPathname)
  }

  render() {
    const { onRequestClose, url, langs, selectedLang, style } = this.props

    return (
      <div
        style={style}
        className='position-fixed fixed-top fixed-bottom bg-dark w-25 text-light p-3'>

        <button onClick={onRequestClose}>x</button>
        <Link to={url()} onClick={onRequestClose}><h1>175 <br /> Joer Post</h1></Link>

        <p>A long history of comunication, technologies, services and people.</p>

        <div>
          <div><Link to={url('/map')} onClick={onRequestClose}>Map</Link></div>
          <div><Link to={url('/timeline')} onClick={onRequestClose}>Timeline</Link></div>
          <div><Link to={url('/about')} onClick={onRequestClose}>About</Link></div>
        </div>

        <div>
          {langs.map(lang => (
            <button
              onClick={() => this.changeLang(lang.param)}
              style={{ backgroundColor: lang.code === selectedLang.code ? 'red' : undefined }}
              key={lang.code}>{lang.label}</button>
          ))}
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
