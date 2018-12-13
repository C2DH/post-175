import React, { memo } from 'react'

export default memo(function TopControls({
  durationSeconds,
  playedSeconds,
}) {
  return (
    <React.Fragment>
      <div className="control-button border-right"></div>
      <div className="control-button"></div>
      <div className="track-container">
        <div className="video-meta">
          
        </div>
        <div className="track"> </div>
      </div>
    </React.Fragment>
  )
})
