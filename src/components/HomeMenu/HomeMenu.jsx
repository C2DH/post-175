import React from 'react'
import classNames from 'classnames'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { TransitionMotion, spring } from 'react-motion'
import { connect } from 'react-redux'
import {
  getLangs,
  getSelectedLang,
  getMakeLangUrl,
} from '../../state/selectors'
import './HomeMenu.scss'

const HomeMenu = ({ langs, selectedLang, className, url }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const changeLang = (langParam) => {
    const currentUrl = location.pathname + location.search
    navigate(url(currentUrl, langParam))
  }

  return (
    <div className={`HomeMenu d-flex flex-column ${className}`}>
      <div className='info d-none d-md-flex'>
        <NavLink
          to={{ pathname: '/about', search: `?lang=${selectedLang.param}` }}
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
  )
}

export default connect((state) => ({
  url: getMakeLangUrl(state),
  langs: getLangs(state),
  selectedLang: getSelectedLang(state),
}))(HomeMenu)
