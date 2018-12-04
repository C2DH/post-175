import React from 'react'
import get from 'lodash/get'

export default function CollectionImage({ doc }) {
  const src = get(doc, 'data.resolutions.medium.url', doc.snapshot)

  if (!src) {
    return <div className='image-placeholder'>{doc.data.type}</div>
  }

  return (
    <img
      src={src}
      alt={doc.title}
    />
  )
}
