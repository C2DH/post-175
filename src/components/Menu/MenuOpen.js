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
        className='position-fixed fixed-top fixed-bottom w-25 bg-black p-3 d-flex flex-column'>

        <div>
          <button onClick={onRequestClose} className="btn bg-black border-0">
            <i className="material-icons">close</i>
          </button>
        </div>
        <Link to={url('/')} onClick={onRequestClose}><h1 className="display-4 text-light">175 <br /> Joer Post</h1></Link>

        <p className="text-grey" style={{fontSize: 18}}>A long history of comunication, technologies, services and people.</p>
        <div className="flex-1 d-flex flex-column justify-content-center">
          <div>
            <div>
              <Link to={url('/map')} onClick={onRequestClose}>
                <h3 className="text-light font-weight-light"><u>Map</u></h3>
              </Link>
            </div>
            <div>
              <Link to={url('/timeline')} onClick={onRequestClose}>
                <h3 className="text-light font-weight-light"><u>Timeline</u></h3>
              </Link>
            </div>
            <div>
              <Link to={url('/about')} onClick={onRequestClose}>
              <h3 className="text-light font-weight-light"><u>About</u></h3>
            </Link>
          </div>
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
        <div className="bg-light position-fixed w-100 fixed-bottom h-100px">

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
