import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LangRoot from './LangRoot'

const Root = () => (
  <Routes>
    <Route path='/*' element={<LangRoot />} />
  </Routes>
)

export default Root
