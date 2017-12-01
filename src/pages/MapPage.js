import React, { PureComponent } from 'react'
import TopBar from '../components/TopBar'

class MapPage extends PureComponent {
  render() {
    return (
      <div className='container-fluid p-0'>
        <TopBar title={'MAP'} />
        <h1>MAP</h1>
      </div>
    )
  }
}

export default MapPage
