import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Menu from '../Menu'
import LangRoot from './LangRoot'

const Root = () => (
  <div>
    <Menu />
    <Switch>
      <Route path='/:lang' component={LangRoot} />
      <Redirect from='/' to='/de' />
    </Switch>
  </div>
)

export default Root
