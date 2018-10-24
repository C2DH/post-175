import React from 'react'

const DocumentDetail = ({ history, location }) => (
  <div style={{
    width: '100%',
    height: '100%',
    background: 'limegreen',
    textAlign: 'center',
  }}>
    <button onClick={() => {
      history.push('/collection')
    }}>CLOSE</button>
    <br />
    I AM DETAIL!
  </div>
)

export default DocumentDetail
