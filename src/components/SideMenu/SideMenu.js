import React, { PureComponent } from 'react'
import classNames from 'classnames'
import { withRouter, NavLink } from 'react-router-dom'
import { TransitionMotion, spring } from 'react-motion'
import { connect } from 'react-redux'
import { getLangs, getSelectedLang, getMakeLangUrl } from '../../state/selectors'
import './SideMenu.css'
import clockIcon from './clock.svg'
import mapIcon from './map.svg'
import archiveIcon from './archive.svg'
import listRichIcon from './list-rich.svg'

class SideMenu extends PureComponent {
  state = {
    expanded: false,
  }

  changeLang = (langParam) => {
    const { url, location } = this.props
    const currentUrl = location.pathname + location.search
    this.props.history.push(url(currentUrl, langParam))
  }

  handleMouseEnter = () => this.setState({ expanded: true })

  handleMouseLeave = () => this.setState({ expanded: false })

  render() {
    const { langs, selectedLang } = this.props
    return (
      <div
        className={classNames('side-menu', {
          'expanded': this.state.expanded,
        })}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >

        <div className='side-menu-top'>
          <NavLink
            to={{ pathname: '/timeline', search: `?lang=${selectedLang.param}` }}
            className='side-menu-link'>
            <div className='link-icon'><img src={clockIcon} alt='Clock' /></div>
            <div className='link-label'>Timeline</div>
          </NavLink>
          <NavLink
            to={{ pathname: '/map', search: `?lang=${selectedLang.param}` }}
            className='side-menu-link'>
            <div className='link-icon'><img src={mapIcon} alt='Map' /></div>
            <div className='link-label'>Map</div>
          </NavLink>
          <NavLink
            to={{ pathname: '/collection', search: `?lang=${selectedLang.param}` }}
            className='side-menu-link'>
            <div className='link-icon'><img src={archiveIcon} alt='Archive' /></div>
            <div className='link-label'>Archive</div>
          </NavLink>
          <NavLink
            to={{ pathname: '/stories', search: `?lang=${selectedLang.param}` }}
            className='side-menu-link'>
            <div className='link-icon'><img src={listRichIcon} alt='List rich' /></div>
            <div className='link-label'>Thematic Dossiers</div>
          </NavLink>


        </div>
        <div className='side-menu-vertical-label-container'>
          <div className='side-menu-vertical-label'>
            L'histoire du service postal
          </div>
        </div>

        <div className='side-menu-bottom'>
          <NavLink
            to={{ pathname: '/about', search: `?lang=${selectedLang.param}` }}
            className='side-menu-link no-bordered'>
            <div className='link-icon'><img src={listRichIcon} alt='About' /></div>
            <div className='link-label'>About</div>
          </NavLink>
          {langs.map(lang => (
            <div
              onClick={() => this.changeLang(lang.param)}
              key={lang.code}
              className={classNames('side-menu-lang', {
                'current-lang': lang.code === selectedLang.code,
              })}>
              {lang.param}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default withRouter(connect(state => ({
  url: getMakeLangUrl(state),
  langs: getLangs(state),
  selectedLang: getSelectedLang(state),
}))(SideMenu))
