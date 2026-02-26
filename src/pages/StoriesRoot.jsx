import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { connect } from 'react-redux'
import { unloadChapters } from '../state/actions'
import Stories from './Stories'
import Story from './Story'

const StoriesRoot = ({ unloadChapters }) => {
  useEffect(() => () => unloadChapters(), [unloadChapters])

  return (
    <Routes>
      <Route index element={<Stories />} />
      <Route path=':id' element={<Story />} />
    </Routes>
  )
}

export default connect(undefined, {
  unloadChapters,
})(StoriesRoot)
