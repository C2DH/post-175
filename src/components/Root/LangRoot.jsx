import React, { Fragment, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import qs from 'query-string'
import { find, get } from 'lodash'
import Media from 'react-media'
import BrowserDetection from 'react-browser-detection'
import { getLangs } from '../../state/selectors'
import { setLang } from '../../state/actions'
import Home from '../../pages/Home'
import Map from '../../pages/Map'
import TimelinePage from '../../pages/Timeline'
import TimelineMobilePage from '../../pages/TimelineMobile'
import About from '../../pages/About'
import TermsOfUse from '../../pages/TermsOfUse'
import Collection from '../../pages/Collection'
import DocumentDetail from '../../pages/DocumentDetail'
import DocumentDetailModal from '../../pages/DocumentDetailModal'
import StoriesRoot from '../../pages/StoriesRoot'
import CookieBanner from '../CookieBanner'
import IeWarning from '../IeWarning'

const browserHandler = {
  ie: () => <IeWarning></IeWarning>,
}

const LangRoot = ({ langs, setLang }) => {
  const location = useLocation()
  const navigationType = useNavigationType()
  const previousLocationRef = useRef(location)
  const previousSearchRef = useRef(null)

  const getLangFromSearch = (search) => {
    const langParam = get(qs.parse(search), 'lang', 'fr')
    return find(langs, { param: langParam })
  }

  useEffect(() => {
    const langFromUrl = getLangFromSearch(location.search)
    const previousSearch = previousSearchRef.current
    const previousLangFromUrl = previousSearch
      ? getLangFromSearch(previousSearch)
      : null

    if (
      langFromUrl &&
      (!previousLangFromUrl || langFromUrl.code !== previousLangFromUrl.code)
    ) {
      setLang(langFromUrl.code)
    }

    previousSearchRef.current = location.search
  }, [location.search, langs, setLang])

  useEffect(() => {
    if (
      navigationType !== 'POP' &&
      (!location.state || !location.state.modal)
    ) {
      previousLocationRef.current = location
    }
  }, [location, navigationType])

  const isModal = !!(
    location.state &&
    location.state.modal &&
    previousLocationRef.current !== location
  )

  return (
    <Fragment>
      <Media query='(max-width: 767.98px)'>
        {(matches) =>
          matches ? (
            <Fragment>
              <Routes
                location={isModal ? previousLocationRef.current : location}
              >
                <Route path='/' element={<Home />} />
                <Route path='/map' element={<Map />} />
                <Route path='/timeline' element={<TimelineMobilePage />} />
                <Route path='/about' element={<About />} />
                <Route path='/terms-of-use' element={<TermsOfUse />} />
                <Route path='/collection' element={<Collection />} />
                <Route path='/stories/*' element={<StoriesRoot />} />
                <Route path='/doc/:id' element={<DocumentDetail />} />
              </Routes>
              {isModal ? (
                <Routes>
                  <Route path='/doc/:id' element={<DocumentDetailModal />} />
                </Routes>
              ) : null}
            </Fragment>
          ) : (
            <Fragment>
              <Routes
                location={isModal ? previousLocationRef.current : location}
              >
                <Route path='/' element={<Home />} />
                <Route path='/map' element={<Map />} />
                <Route path='/timeline' element={<TimelinePage />} />
                <Route path='/about' element={<About />} />
                <Route path='/terms-of-use' element={<TermsOfUse />} />
                <Route path='/collection' element={<Collection />} />
                <Route path='/stories/*' element={<StoriesRoot />} />
                <Route path='/doc/:id' element={<DocumentDetail />} />
              </Routes>
              {isModal ? (
                <Routes>
                  <Route path='/doc/:id' element={<DocumentDetailModal />} />
                </Routes>
              ) : null}
            </Fragment>
          )
        }
      </Media>
      <BrowserDetection>{browserHandler}</BrowserDetection>
      <CookieBanner />
    </Fragment>
  )
}

const mapStateToProps = (state) => ({
  langs: getLangs(state),
})
export default connect(mapStateToProps, {
  setLang,
})(LangRoot)
