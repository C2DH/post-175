import React, { PureComponent } from 'react'
import TopBar from '../components/TopBar'

class Timeline extends PureComponent {
  render() {
    return (
      <div className='container-fluid p-0'>
        <div className='row'>
          <div className='col-md-3'>
            <TopBar title={'TIMELINE'} />
            1830 - 1880
          </div>
          <div className='col-md-9'>
            ...
          </div>
        </div>
      </div>
    )
  }
}

export default Timeline
