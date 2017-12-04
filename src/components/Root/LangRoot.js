import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { find } from 'lodash'
import { getLangs } from '../../state/selectors'
import { setLang } from '../../state/actions'
import Home from '../../pages/Home'
import MapPage from '../../pages/MapPage'
import Timeline from '../../pages/Timeline'
import About from '../../pages/About'

class LangRoot extends PureComponent {
  componentWillMount() {
    const { match } = this.props
    const langFromUrl = this.getLangFromParam(match.params.lang)
    if (langFromUrl) {
      this.props.setLang(langFromUrl.code)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.lang !== nextProps.match.params.lang) {
      const langFromUrl = this.getLangFromParam(nextProps.match.params.lang)
      if (langFromUrl) {
        this.props.setLang(langFromUrl.code)
      }
    }
  }

  getLangFromParam = (param) => {
    return find(this.props.langs, { param })
  }

  render() {
    const { match } = this.props

    if (!this.getLangFromParam(match.params.lang)) {
      return <Redirect to='/de' />
    }

    return (
      <Switch>
        <Route path={`${match.url}`} exact component={Home} />
        <Route path={`${match.url}/map`} exact component={MapPage} />
        <Route path={`${match.url}/timeline`} exact component={Timeline} />
        <Route path={`${match.url}/about`} exact component={About} />
      </Switch>
    )
  }
}

const mapStateToProps = state => ({
  langs: getLangs(state),
})
export default withRouter(connect(mapStateToProps, {
  setLang,
})(LangRoot))
