import React, { memo } from 'react'
import { UncontrolledTooltip } from 'reactstrap';
import moment from 'moment'

export default memo(function TopControls({
  durationSeconds,
  playedSeconds,
  played,
  sideDocs,
  story,
  playing,
  togglePlaying,
  onSeek,
  volume,
  setVolume,
}) {
  const playedMinutes = moment.utc(parseInt(playedSeconds) * 1000).format('mm:ss')
  const durationMinutes = moment.utc(parseInt(durationSeconds) * 1000).format('mm:ss')
  return (
    <React.Fragment>
      <div className="control-button border-right">↰</div>
      <div className="control-button" onClick={togglePlaying}>
        { playing ? <span>&#9632;</span> : <span>&#9654;</span> }
      </div>
      <div className="track-container">
        <div className="video-meta text-white">
          <div className="d-flex h-100 align-items-center">
            <h3 className="mx-2">{story.data.title}</h3>
            <div>{playedMinutes}/{durationMinutes}</div>
          </div>
          <div
            onClick={() => setVolume(volume === 0 ? 1 : 0)}
            style={{ textDecoration: volume === 0 ? 'line-through' : undefined, cursor: 'pointer' }}>{'♪'}</div>
        </div>
        <div className="track" onClick={e => {
          const rect = e.target.getBoundingClientRect()
          const clickX = e.clientX - rect.x
          const percentOffset = clickX / rect.width
          onSeek(percentOffset)
        }}>

          <div className="progress" style={{width: `${played*100}%`}}></div>
          {sideDocs && sideDocs.length > 0 && sideDocs.map((sideDoc, i) => (
            <React.Fragment  key={i} >
              <div id={`side-doc-${i}`} className="side-doc" style={{left: `${sideDoc.secondsFrom/durationSeconds*100}%`}} />
              <UncontrolledTooltip placement="bottom" target={`side-doc-${i}`} className="side-doc-tooltip">
                {sideDoc.doc.title}
              </UncontrolledTooltip>
            </React.Fragment>

          ) )}
        </div>
      </div>
    </React.Fragment>
  )
})
