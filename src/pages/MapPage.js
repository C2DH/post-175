import React, { PureComponent } from 'react'
import Legend from '../components/Legend'
import TopBar from '../components/TopBar'


class MapPage extends PureComponent {
  render() {
    return (
      <div className="h-100vh d-flex flex-column">
        <TopBar title={'MAP'} />
        <div className='d-inline-flex flex-1'>
          <Legend />
          <div className="w-100 flex-1 bg-success">
            <h1 className="display-3">MAP CONTAINER</h1>
          </div>
        </div>
      </div>
    )
  }
}

export default MapPage
