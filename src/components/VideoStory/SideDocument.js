import React, { memo } from 'react'
import { DraggableCore } from 'react-draggable'

export default memo(function SideDocument({ onDrag, width, doc }) {
  console.log('OOO', doc)
  return (
    <div className='side-document' style={{ width }}>

      {doc && <div className='display-doc'>

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
