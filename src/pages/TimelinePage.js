import React, { PureComponent } from 'react'
import Period from '../components/Period'
import TimelineNavigation from '../components/TimelineNavigation'
import Timeline from '../components/Timeline'

class TimelinePage extends PureComponent {
  render() {
    return (
      <div className='h-100vh d-flex flex-column'>
        <div className='row no-gutters flex-1'>
          <Period />
          <Timeline />
        </div>
      </div>
    )
  }
}

export default TimelinePage
