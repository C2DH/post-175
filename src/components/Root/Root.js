import React, { Fragment } from 'react'
import { Route } from 'react-router-dom'
import Menu from '../Menu'
import LangRoot from './LangRoot'

const Root = () => (
  <Fragment>
    <Menu />
    <Route path='/' component={LangRoot} />
  </Fragment>
)

export default Root
