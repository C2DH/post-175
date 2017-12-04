import React, { PureComponent } from 'react'
import TimelineNavigation from './TimelineNavigation'

class Timeline extends PureComponent {
  render() {
    return (
      <div className='col-md-9 bg-light d-flex flex-column'>

        {/* top timeline */}
        <div className="align-self-start bg-warning w-100 " style={{height:52}}>

        </div>


        <div className="bg-secondary align-self-stretch flex-1 position-relative" style={{overflow:'hidden'}}>

          <div className="position-absolute bg-primary" style={{width:30000, height:100, transform:'translate(100px, 0)'}}>

          </div>

        </div>

        {/* bottom timeline */}
        <TimelineNavigation />
      </div>
    )
  }
}

export default Timeline
