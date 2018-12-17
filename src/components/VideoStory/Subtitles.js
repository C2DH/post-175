import React, { memo } from 'react'

export default memo(function Subtitles({ subtitles }) {
  return (
    <div className='subtitles'>
      {subtitles.map((sub, index) => (
        <div key={index}>{sub}</div>
      ))}
    </div>
  )
})
