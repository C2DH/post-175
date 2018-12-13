import React, { memo } from 'react'

export default memo(function TopControls({
  durationSeconds,
  playedSeconds,
}) {
  return (
    <div className='text-white'>
      {playedSeconds}{' / '}{durationSeconds}
    </div>
  )
})
