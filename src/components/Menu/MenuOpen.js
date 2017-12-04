import React, { PureComponent } from 'react'
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
    const { onRequestClose, url, langs, selectedLang, style } = this.props

    return (
      <div
        style={style}
        className='position-fixed fixed-top fixed-bottom bg-dark w-25 text-light p-3'>

        <button onClick={onRequestClose} className="bg-dark text-light">x</button>
        <Link to={url('/')} onClick={onRequestClose}><h1>175 <br /> Joer Post</h1></Link>

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
