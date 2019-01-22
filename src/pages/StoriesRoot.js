import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { unloadChapters } from '../state/actions'
import Stories from './Stories'
import Story from './Story'

class StoriesRoot extends Component {
  componentWillUnmount() {
    this.props.unloadChapters()
  }

  render() {
    const { match } = this.props
    return (
      <Switch>
        <Route path={`${match.path}`} exact component={Stories} />
        <Route path={`${match.path}/:id`} exact component={Story} />
      </Switch>
    )
  }
}

export default connect(undefined, {
  unloadChapters,
})(StoriesRoot)
