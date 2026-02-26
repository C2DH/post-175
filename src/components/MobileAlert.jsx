import React from 'react'
import MediaQuery from 'react-responsive'

const MobileAlert = () => (
  <MediaQuery maxWidth={992}>
    <div className='mobile-alert'>
      This is site is optimized for desktop
    </div>
  </MediaQuery>
)

export default MobileAlert
