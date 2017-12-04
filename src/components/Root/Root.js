import React from 'react'
import { Route } from 'react-router-dom'
import Menu from '../Menu'
import LangRoot from './LangRoot'

const Root = () => (
  <div>
    <Menu />
    <Route path='/' component={LangRoot} />
  </div>
)

export default Root
