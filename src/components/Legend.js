import React, { PureComponent } from 'react'
import TopBar from './TopBar'
import LegendIntro from './LegendIntro'
import LegendDetail from './LegendDetail'

const CloseLegendDetailBtn = ({onclick}) => (
  <div className="position-absolute legend-close-btn" style={{ zIndex: 999 }}>
    <button className="btn btn-light rounded-0 d-flex justify-content-center" onClick={onclick}>
      <i className="material-icons font-14">close</i>
    </button>
  </div>
)

class Legend extends PureComponent {

  render () {
    const { selectedPlace, onClose } = this.props
    return (
      <div className="col-md-3 bg-info d-flex flex-column">
        <TopBar title={'MAP'} />
        {selectedPlace &&
          <CloseLegendDetailBtn onclick={onClose} />}
        {selectedPlace ? <LegendDetail place={selectedPlace} /> : <LegendIntro />}
      </div>

    )
  }
}

export default Legend