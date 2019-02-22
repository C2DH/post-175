import React, { memo } from 'react'

// firstLoding: means if is first loading or another loading
// Es:. a subsequent search is another loading
// screen: means the page of spinner values:
// collection, docDetail, timeline, map
export default memo(function Spinner({ firstLoading, screen }) {
  if (firstLoading) {
    console.log(`Render Spinner in screen ${screen} while first loading!`)
  } else {
    console.log(`Render Spinner in screen ${screen} for another time!`)
  }
  return null
})
