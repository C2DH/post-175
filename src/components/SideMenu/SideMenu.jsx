import React, { useState } from 'react'
import classNames from 'classnames'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { TransitionMotion, spring } from 'react-motion'
import { connect } from 'react-redux'
import { localize } from '../../localize'
import {
  getLangs,
  getSelectedLang,
  getMakeLangUrl,
} from '../../state/selectors'
import './SideMenu.scss'
import mapIcon from './map.svg'

const SideMenu = ({ url, langs, selectedLang, t }) => {
  const [expanded, setExpanded] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const changeLang = (langParam) => {
    const currentUrl = location.pathname + location.search
    navigate(url(currentUrl, langParam))
  }

  const handleMouseEnter = () => setExpanded(true)

  const handleMouseLeave = () => setExpanded(false)

  return (
    <React.Fragment>
      <div
        className={classNames('side-menu-expanded', {
          open: expanded,
        })}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleMouseLeave}
      >
        <div className='side-menu-top'>
          <NavLink
            to={{
              pathname: '/timeline',
              search: `?lang=${selectedLang.param}`,
            }}
            className='side-menu-link'
          >
            <div className='link-label'> {t('menu_timeline')}</div>
          </NavLink>
          <NavLink
            to={{
              pathname: '/collection',
              search: `?lang=${selectedLang.param}`,
            }}
            className='side-menu-link'
          >
            <div className='link-label'>{t('menu_collection')}</div>
          </NavLink>
          <NavLink
            to={{ pathname: '/map', search: `?lang=${selectedLang.param}` }}
            className='side-menu-link'
          >
            <div className='link-label'>{t('menu_map')}</div>
          </NavLink>
          <NavLink
            to={{
              pathname: '/stories',
              search: `?lang=${selectedLang.param}`,
            }}
            className='side-menu-link'
          >
            <div className='link-label'>{t('menu_themes')}</div>
          </NavLink>
        </div>
        <div className='side-menu-desc-container'>
          <p className=''>{t('menu_desc')}</p>
        </div>

        <div className='side-menu-bottom'>
          {/*  <NavLink
              to={{
                pathname: "/contact-us",
                search: `?lang=${selectedLang.param}`
              }}
              className="side-menu-link no-bordered"
            >
              <div className="link-label"> {t("menu_contact_us")}</div>
            </NavLink>*/}
          <NavLink
            to={{
              pathname: '/terms-of-use',
              search: `?lang=${selectedLang.param}`,
            }}
            className='side-menu-link no-bordered'
          >
            <div className='link-label'> {t('menu_terms_of_use')}</div>
          </NavLink>
          <NavLink
            to={{ pathname: '/about', search: `?lang=${selectedLang.param}` }}
            className='side-menu-link no-bordered'
          >
            <div className='link-label'> {t('menu_about')}</div>
          </NavLink>
          <div className='side-menu-logo d-flex flex-wrap align-items-center'>
            <div className='col-4'>
              <a href='https://uni.lu' target='_blank'>
                <img className='img-fluid' src='/img/unilu.jpg' />
              </a>
            </div>
            <div className='col-4'>
              <a href='https://www.c2dh.uni.lu/' target='_blank'>
                <img className='img-fluid' src='/img/c2dh.jpg' />
              </a>
            </div>
            <div className='col-4'>
              <a href='https://www.post.lu/' target='_blank'>
                <img className='img-fluid' src='/img/post.png' />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div
        className={classNames('side-menu', {
          open: expanded,
        })}
        onClick={handleMouseLeave}
      >
        <div
          className='side-menu-top'
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <NavLink
            to={{
              pathname: '/timeline',
              search: `?lang=${selectedLang.param}`,
            }}
            className='side-menu-link'
          >
            <div className='link-icon'>
              <i className='material-icons'>access_time</i>
            </div>
          </NavLink>
          <NavLink
            to={{
              pathname: '/collection',
              search: `?lang=${selectedLang.param}`,
            }}
            className='side-menu-link'
          >
            <div className='link-icon'>
              <i className='material-icons'>photo_library</i>
            </div>
          </NavLink>
          <NavLink
            to={{ pathname: '/map', search: `?lang=${selectedLang.param}` }}
            className='side-menu-link'
          >
            <div className='link-icon'>
              <img src={mapIcon} alt='Map' />
            </div>
          </NavLink>
          <NavLink
            to={{
              pathname: '/stories',
              search: `?lang=${selectedLang.param}`,
            }}
            className='side-menu-link'
          >
            <div className='link-icon'>
              <i className='material-icons'>subscriptions</i>
            </div>
          </NavLink>
        </div>
        <div
          className='side-menu-vertical-label-container'
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className='side-menu-vertical-label'>
            <NavLink
              to={{ pathname: '/', search: `?lang=${selectedLang.param}` }}
              className='side-menu-home-link'
            >
              {t('home_title')}
            </NavLink>
          </div>
        </div>
        <div className='side-menu-bottom d-flex flex-column'>
          <div
            className='lang info'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <NavLink
              to={{
                pathname: '/about',
                search: `?lang=${selectedLang.param}`,
              }}
              className='d-flex'
            >
              <i className='material-icons text-dark'>info</i>
            </NavLink>
          </div>
          {langs.map((lang) => (
            <div
              onClick={() => changeLang(lang.param)}
              key={lang.code}
              className={classNames('lang', {
                'current-lang': lang.code === selectedLang.code,
              })}
            >
              {lang.param}
            </div>
          ))}
        </div>
      </div>
      <div className='openMobile d-block d-md-none'>
        <div className='button' onClick={handleMouseEnter}>
          <i className='material-icons'>menu</i>
        </div>
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  url: getMakeLangUrl(state),
  langs: getLangs(state),
  selectedLang: getSelectedLang(state),
})

export default localize()(connect(mapStateToProps)(SideMenu))
