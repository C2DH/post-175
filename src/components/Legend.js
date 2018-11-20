import React, { PureComponent } from 'react'
import TopBar from './TopBar'
import LegendIntro from './LegendIntro'
import LegendDetail from './LegendDetail'
import { Motion, TransitionMotion, spring } from 'react-motion'
import { localize } from '../localize'

const CloseLegendDetailBtn = ({onclick}) => (
  <div className="position-absolute legend-close-btn" style={{ zIndex: 999 }}>
    <button className="btn btn-light legend-close rounded-0 d-flex justify-content-center" onClick={onclick}>
      <i className="material-icons font-14">close</i>
    </button>
  </div>
)

class Legend extends PureComponent {

  render () {
    const { story, selectedPlace, onClose, t } = this.props
    return (
      <div>
         {selectedPlace &&
           <CloseLegendDetailBtn onclick={onClose} />}

        <TransitionMotion
          defaultStyles={selectedPlace ? [{ key: 'place', data: { selectedPlace }, style: { x: -500 }}] : []}
          styles={selectedPlace ? [{ key: 'place', data: { selectedPlace }, style: { x: spring(0) }}] : []}
          willLeave={() => ({ x: spring(-500) })}
          willEnter={() => ({ x: -500 })}
        >
          {styles =>
            <div>
            {styles.map(({ style: { x }, key, data: { selectedPlace } }) => (
              <LegendDetail
                key={key}
                style={{ left: x }}
                place={selectedPlace}
              />
            ))}
            </div>
        }
        </TransitionMotion>
      </div>
    )
  }
}

export default localize()(Legend)
