import React, { memo } from 'react'
import { DraggableCore } from 'react-draggable'

export default memo(function SideDocument({ onDrag, width, doc }) {
  let year = null
  if (doc) {
    year = new Date(doc.data.start_data).getFullYear()
    year = isNaN(year) ? null : year
  }
  return (
    <div className='side-document' style={{ width }}>

      {doc && <div className='display-doc'>
        <div className='year'>{year}</div>
        <div className='title'>
          <h2>{doc.title}</h2>
          <a>OPEN</a>
        </div>
        <div
          className='doc-image'
          style={{ backgroundImage: `url(${doc.attachment ? doc.attachment : doc.snapshot})` }}
        />
      </div>}

      <DraggableCore onDrag={onDrag}>
        <div className='handle-circle-container'>
          <svg width={50} height={50}>
            <circle cx={25} cy={25} r={25} fill={'grey'} />
            <circle cx={25} cy={25} r={15} fill={'yellow'} />
          </svg>
        </div>
      </DraggableCore>
    </div>
  )
})
