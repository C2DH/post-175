import React, { memo } from 'react'

export default memo(function Spinner({ firstLoding }) {
  if (firstLoding) {
    console.log('Render Spinner while first loading!')
  } else {
    console.log('Render Spinner for another time!')
  }
  return null
})
