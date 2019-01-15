import React from 'react'
import { connect } from 'react-redux'
import ReactPlayer from 'react-player'
import map from 'lodash/map'
import ZoomAndPanMedia from '../ZoomAndPanMedia'
import { getSelectedLang } from '../../state/selectors'
import PdfViewer from './PdfViewer'


function DocMedia({ doc, lang }) {
  if (doc.type === 'video') {
    // Video
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
  } else if (doc.type === 'pdf') {
    if (doc.attachment === null) {
      return null
    }
    // PDF
    const pdfFile = process.env.NODE_ENV === 'production'
      ? doc.attachment
      // IN dev replace \w dev proxy 2 avoid CORS problems
      : doc.attachment.replace(/^(https:\/\/)(.*)\/media\/(.*)$/, 'http://localhost:3000/media/$3')

    console.log('PDF FILE: ', pdfFile)

    return (
      <PdfViewer file={pdfFile} />
      // <div className='doc-media-pdf'>
      //   <div  style={{ height: 100, background: 'red' }} />
      //   <div className='pdf-container'>
      //     <Document
      //       className='pdf-pdf'
      //       file={pdfFile}
      //     >
      //       <Page
      //         pageNumber={1}
      //       />
      //     </Document>
      //   </div>
      // </div>
    )
  } else if (doc.type === '360viewer') {
    return (
      <iframe
        className='h-100 w-100 border-0'
        src={doc.url}
      />
    )
  } else {
    // Image
    return (
      <ZoomAndPanMedia
        src={doc.attachment ? doc.snapshot : doc.attachment}
      />
    )
  }
}

export default connect(state => ({
  lang: getSelectedLang(state),
}))(DocMedia)
