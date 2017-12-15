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
    return (
      <div className="d-flex flex-column overflow-auto" style={{ zIndex: 1, position: 'absolute', top: 0, bottom: 0 }}>
        <div className="w-100 p-3 bg-light">
          <h3>Expolore the map of the Post offices of Luxembourg</h3>
        </div>
        <div className="w-100 flex-1 p-3 bg-white font-14">
          <p>Nulla porttitor accumsan tincidunt. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;
            Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.
            Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Pellentesque in ipsum id orci porta dapibus.
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae</p>
            <MapPointsLegend />
        </div>
        <div className="w-100 h-100px p-3 bg-light">
          <span className="font-9 form-text">ulla porttitor accumsan tincidunt. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;
            Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus.</span>
        </div>
      </div>
    )
  }
}

export default LegendIntro
