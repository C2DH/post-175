import React, { PureComponent } from 'react'
import { localize } from '../localize'

const points = [
  { color: '#ed6505', description: 'event'},
  { color: '#186a0f', description: 'legislation'},
  { color: '#55f7df', description: 'service'},
  { color: '#2933ff', description: 'cooperation'},
  { color: '#fdd00c', description: 'staff'},
  { color: '#b413da', description: 'transport'},
  { color: '#ff3e4c', description: 'building'},
  { color: '#13d436', description: 'technology'},
]

class TimelineLegend extends PureComponent {
  render() {
  const { onClick, t , story} = this.props
    return (
      <div className="d-flex flex-column flex-1 bg-white" style={{minHeight: '0', position:'relative'}}>
        <i className="material-icons pointer timeline-legend-close" onClick={onClick}>close</i>
        <div className="timeline-legend-intro d-flex flex-1 p-3 mt-4">
          <p>
            {story?story.data.abstract:''}
          </p>
        </div>
        <div className="timeline-legend d-flex flex-column p-3 font-14">
          {points.map((p, i) => (
            <div className="d-inline-flex" key={i}>
              <svg width={30} height={30}>
                <circle cx="10" cy="10" r={9} fill={p.color} />
              </svg>
              <span className="font-12">{t(p.description)}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default localize()(TimelineLegend)
