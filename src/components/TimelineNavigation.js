import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux'
import { getEvents, getEventsExtent, getTimelineCurrentDate } from '../state/selectors'
import { setDateTimeline } from '../state/actions'
import TimelineNavigationControlled, { TimelineTicks, TimelineEvents } from './TimelineNavigationControlled'

class TimelineNavigation extends PureComponent {
  render() {
    const { extent, events, currentDate, setDateTimeline } = this.props

    return (
      <TimelineNavigationControlled
        className='align-self-end'
        currentDate={currentDate}
        onDateChange={setDateTimeline}
        extent={extent}
      >
        {({ width, height, scale, ticks }) => (
          <Fragment>
            <div className="d-inline-flex flex-1 w-100">
              <TimelineEvents events={events} cy={height / 4} scale={scale} />
            </div>
            <div className="d-inline-flex flex-1 w-100">
              <TimelineTicks ticks={ticks} y={height / 4} scale={scale} />
            </div>
          </Fragment>
        )}
      </TimelineNavigationControlled>
    )
  }
}

const mapStateToProps = state => ({
  currentDate: getTimelineCurrentDate(state),
  events: getEvents(state),
  extent: getEventsExtent(state),
})
export default connect(mapStateToProps, {
  setDateTimeline,
})(TimelineNavigation)
