import React from 'react'

const DocDetail = ({ doc, onClose }) => (
  <div className='h-100 w-100 bg-info'>
    DOC {doc.id}
    <button onClick={onClose}>CLOSE</button>
  </div>
)

export default DocDetail
