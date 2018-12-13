import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import classNames from 'classnames'
import { getLangs, getSelectedLang, getMakeLangUrl } from '../../state/selectors'

function LangSwitcher({ langs, url, selectedLang, location, history }) {
  return (
    <div className='lang-switcher'>
      {langs.map(lang => (
        <div
          onClick={() => {
            const currentUrl = location.pathname + location.search
            history.push(url(currentUrl, lang.param))
          }}
          key={lang.code}
          className={classNames('lang', {
            'current-lang': lang.code === selectedLang.code,
          })}>
          {lang.param}
        </div>
      ))}
    </div>
  )
}

export default withRouter(connect(state => ({
  url: getMakeLangUrl(state),
  langs: getLangs(state),
  selectedLang: getSelectedLang(state),
}))(LangSwitcher))
