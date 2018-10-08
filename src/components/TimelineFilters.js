import React, { PureComponent } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { toggleCategoryTimeline, toggleTimelineMilestone } from '../state/actions'
import { EVENT_COLORS } from '../consts'

class TimelineFilters extends PureComponent {
  render() {
    const { categories, milestone, toggleCategoryTimeline, toggleTimelineMilestone } = this.props
    return (
      <div className='bg-black d-flex p-3 justify-content-between border-bottom border-right'>

        <div className='d-flex align-items-center'>
          <div>CATEGORIES:</div>
          <div className='px-3 d-flex align-items-center'>
            {Object.keys(EVENT_COLORS).map(name => (
              <div
                onClick={() => toggleCategoryTimeline(name)}
                key={name}
                className={classNames('d-flex align-items-center pointer timeline-category-filter', {
                'timeline-category-filter-active': categories.indexOf(name) !== -1,
              })}>
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
          <input
            onChange={() => toggleTimelineMilestone()}
            type="checkbox" className='mx-2' checked={milestone} />
          All events
        </div>

      </div>
    )
  }
}

export default connect(state => ({
  categories: state.timeline.categories,
  milestone: state.timeline.milestone,
}), {
  toggleCategoryTimeline,
  toggleTimelineMilestone,
})(TimelineFilters)
