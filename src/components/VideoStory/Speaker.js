import React, { memo, Fragment } from 'react'

export default memo(function Speaker({ doc }) {
  console.log('O.o', doc)
  return (
    <div className='speaker'>
      {doc && <Fragment>
        <h5>{doc.title}</h5>
        <h1>{doc.title}</h1>
      </Fragment>}
    </div>
  )
})
