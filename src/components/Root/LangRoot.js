import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Route, Switch, withRouter } from 'react-router-dom'
import qs from 'query-string'
import { find, get } from 'lodash'
import { getLangs } from '../../state/selectors'
import { setLang } from '../../state/actions'
import Home from '../../pages/Home'
import MapPage from '../../pages/MapPage'
import TimelinePage from '../../pages/TimelinePage'
import About from '../../pages/About'
import Collection from '../../pages/Collection'
import { AnimatedSwitch } from 'react-router-transition';

class LangRoot extends PureComponent {
  componentWillMount() {
    const langFromUrl = this.getLangFromSearch(this.props.location.search)
    if (langFromUrl) {
      this.props.setLang(langFromUrl.code)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.search !== nextProps.location.search) {
      const langFromUrl = this.getLangFromSearch(this.props.location.search)
      const nextLangFromUrl = this.getLangFromSearch(nextProps.location.search)
      // Next lang is valid and different form previous
      if (nextLangFromUrl && (!langFromUrl || langFromUrl.code !== nextLangFromUrl.code)) {
        this.props.setLang(nextLangFromUrl.code)
      }
    }
  }

  getLangFromSearch = (search) => {
    const langParam = get(qs.parse(search), 'lang', 'fr')
    return find(this.props.langs, { param: langParam })
  }

  render() {
    const { lang } = this.props
    return (
      // <AnimatedSwitch
      //   atEnter={{ opacity: 1 }}
      //   atLeave={{ opacity: 0 }}
      //   atActive={{ opacity: 1 }}
      //   className="switch-wrapper"
      //   runOnMount={true}
      // >
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/map' exact component={MapPage} />
        <Route path='/timeline' exact component={TimelinePage} />
        <Route path='/about' exact component={About} />
        <Route path='/collection' exact component={Collection} />
      </Switch>
      // </AnimatedSwitch>
    )
  }
}

const mapStateToProps = state => ({
  langs: getLangs(state),
})
export default withRouter(connect(mapStateToProps, {
  setLang,
})(LangRoot))
