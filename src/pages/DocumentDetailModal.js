import React from 'react'

const DocumentDetail = ({ history, location }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    bottom: 0,
    background: 'limegreen',
    textAlign: 'center',
    left: 0,
    right: 0,
    zIndex: 9999,
  }}>
    <button onClick={() => {
      console.log({ history, location })
      history.goBack()

    }}>CLOSE</button>
    <br />
    I AM DETAIL!
  </div>
)

export default DocumentDetail
