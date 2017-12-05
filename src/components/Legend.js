import React, { PureComponent } from 'react'
import TopBar from './TopBar'
import LegendIntro from './LegendIntro'
import LegendDetail from './LegendDetail'

class Legend extends PureComponent {
  render () {
    return (
      <div className="col-md-3 bg-info d-flex flex-column">
        <TopBar title={'MAP'} />
        <LegendDetail />
      </div>

    )
  }
}

export default Legend
