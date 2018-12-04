import React from 'react'
import ReactPlayer from 'react-player'
import map from 'lodash/map'
import ZoomAndPanMedia from '../ZoomAndPanMedia'

export default function DocMedia({ doc }) {
  console.log('X', doc)
  if (doc.data.type === 'video') {
    let tracks = []
    if (doc.data.subtitles) {
      tracks = map(doc.data.subtitles, sub => ({
        kind: 'subtitles',
        src: sub,
        srcLang: 'fr'
      }))
      console.log('T', tracks)
    }
    return (
      <div className='doc-media-video'>
        <ReactPlayer
          url={doc.url}
          controls
          config={{
            file: {
              tracks,
            }
          }}
        />
      </div>
    )
  }
  return (
    <ZoomAndPanMedia
      src={doc.type === 'pdf' ? doc.snapshot : doc.attachment}
    />
  )
}
