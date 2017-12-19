import React, { PureComponent } from 'react'
import TopBar from './TopBar'

const MapPointsLegend = () => (
  <div className="d-flex flex-column">
    <div className="d-inline-flex">
      <svg width={30} height={30}>
        <circle cx="10" cy="10" r={9} fill="rgb(19, 212, 54)" />
      </svg>
      <span className="font-12">Open Offices</span>
    </div>
    <div className="d-inline-flex">
      <svg width={30} height={30}>
        <circle cx="10" cy="10" r={9} fill="rgb(253, 208, 12)" />
      </svg>
      <span className="font-12">Closed Offices</span>
    </div>
  </div>
)

class LegendIntro extends PureComponent {
  render () {
    const { story } = this.props;
    return (
      <div className="d-flex flex-column overflow-auto" style={{ zIndex: 1, position: 'absolute', top: 0, bottom: 0 }}>
        <div className="w-100 p-3 bg-light">
          <h3>Expolore the map of the Post offices of Luxembourg</h3>
        </div>
        <div className="w-100 flex-1 p-3 bg-white font-14">
          <p>
            {story?story.data.abstract:''}
          </p>
            <MapPointsLegend />
        </div>
        <div className="w-100 h-100px p-3 bg-light">
          <span className="font-9 form-text">
            {story?story.data.legend:''}
          </span>
        </div>
      </div>
    )
  }
}

export default LegendIntro
