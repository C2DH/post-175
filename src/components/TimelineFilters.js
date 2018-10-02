import React, { PureComponent } from 'react'
import { EVENT_COLORS } from '../consts'

export default class TimelineFilters extends PureComponent {
  render() {
    return (
      <div className='bg-black d-flex p-3 justify-content-between border-bottom border-right'>

        <div className='d-flex align-items-center'>
          <div>CATEGORIES:</div>
          <div className='px-3 d-flex align-items-center'>
            {Object.keys(EVENT_COLORS).map(name => (
              <div className='d-flex align-items-center' key={name}>
                <svg height={14} width={14}>
                  <circle r={7} cx={7} cy={7} fill={EVENT_COLORS[name]} />
                </svg>
                <div className='ml-1 mr-3'>{name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* TODO: use a shit like that https://haubek.github.io/custom-switch/ */}
        <div className='d-flex align-items-center'>
          Milestone only
          <input type="checkbox" className='mx-2' />
          All events
        </div>

      </div>
    )
  }
}
