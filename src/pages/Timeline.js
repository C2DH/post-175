import React, { PureComponent } from 'react'
import TopBar from '../components/TopBar'

class Timeline extends PureComponent {
  render() {
    return (
      <div className='h-100vh d-flex flex-column'>
        <div className='row no-gutters flex-1'>
          <div className='col-md-3 bg-info'>
            <TopBar title={'TIMELINE'} />
            1830 - 1880
          </div>
          <div className='col-md-9 bg-light d-flex flex-column'>

            {/* top timeline */}
            <div className="align-self-start bg-warning w-100 " style={{height:52}}>

            </div>


            <div className="bg-secondary align-self-stretch flex-1 position-relative" style={{overflow:'hidden'}}>

              <div className="position-absolute bg-primary" style={{width:30000, height:100, transform:'translate(100px, 0)'}}>

              </div>

            </div>

            {/* bottom timeline */}
            <div className="align-self-end bg-warning w-100" style={{height:100}}>

            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Timeline
