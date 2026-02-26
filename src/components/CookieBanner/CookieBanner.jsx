import React, { Fragment, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { NavLink, useLocation } from 'react-router-dom'
import { Container, Row, Col } from 'reactstrap'
import { withCookies } from 'react-cookie'
import ReactGA, { ga } from 'react-ga'
import { localize } from '../../localize'
import { getSelectedLang } from '../../state/selectors'
import { setCookie, getBooleanCookie } from '../../utils'
import GAOptInOut, { GA_CONSENT_COOKIE } from './GAOptInOut'

import './CookieBanner.scss'

const ACCEPT_COOKIE = 'accepts-cookies'
const CookieBanner = ({ t, cookies, selectedLang }) => {
  const location = useLocation()
  const lastPageRef = useRef(null)

  const initGA = () => {
    if (import.meta.env.VITE_APP_GA_CODE) {
      ReactGA.initialize(import.meta.env.VITE_APP_GA_CODE, {
        gaOptions: {
          cookieFlags: 'samesite=lax',
        },
      })

      const path = location.pathname + location.search
      ReactGA.pageview(path)
      lastPageRef.current = path
      console.info('POST-175 GA enabled:', import.meta.env.VITE_APP_GA_CODE)
    } else {
      console.info('POST-175 GA disabled by config.')
    }
  }

  const accept = () => setCookie(cookies, ACCEPT_COOKIE, true)

  useEffect(() => {
    const gaConsent =
      getBooleanCookie(cookies, ACCEPT_COOKIE) &&
      getBooleanCookie(cookies, GA_CONSENT_COOKIE, true)

    if (!ga() && gaConsent) initGA()
    window[`ga-disable-${import.meta.env.VITE_APP_GA_CODE}`] = !gaConsent
  }, [cookies])

  useEffect(() => {
    if (!ga()) return

    const path = location.pathname + location.search
    if (lastPageRef.current !== path) {
      ReactGA.pageview(path)
      lastPageRef.current = path
    }
  }, [location])

  return (
    <Fragment>
      {!cookies.get(ACCEPT_COOKIE) && (
        <Container fluid className='CookieBanner'>
          <Row className='align-items-center'>
            <Col className='message'>
              {t('cookies')}
              <NavLink
                to={{
                  pathname: '/terms-of-use',
                  search: `?lang=${selectedLang.param}`,
                }}
                className='ml-2 text-nowrap'
              >
                {t('read_more')}
              </NavLink>
              <GAOptInOut />
            </Col>
            <Col md='auto' className='mt-2 mt-md-0'>
              <button onClick={accept}>{t('accept')}</button>
            </Col>
          </Row>
        </Container>
      )}
    </Fragment>
  )
}

const mapStateToProps = (state) => ({
  selectedLang: getSelectedLang(state),
})

export default localize()(withCookies(connect(mapStateToProps)(CookieBanner)))
