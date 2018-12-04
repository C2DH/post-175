import React from 'react'
import { connect } from 'react-redux'
import ReactPlayer from 'react-player'
import map from 'lodash/map'
import ZoomAndPanMedia from '../ZoomAndPanMedia'
import { getSelectedLang } from '../../state/selectors'

function DocMedia({ doc, lang }) {
  if (doc.data.type === 'video') {
    let tracks = []
    if (doc.data.subtitles) {
      tracks = map(doc.data.subtitles, sub => ({
        kind: 'subtitles',
        src: sub,
        srcLang: lang.param
      }))
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

export default connect(state => ({
  lang: getSelectedLang(state),
}))(DocMedia)
