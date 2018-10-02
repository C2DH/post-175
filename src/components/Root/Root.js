import React, { Fragment } from 'react'
import { Route } from 'react-router-dom'
import LangRoot from './LangRoot'

const Root = () => (
  <Fragment>
    <Route path='/' component={LangRoot} />
  </Fragment>
)

export default Root
