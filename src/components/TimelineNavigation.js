import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux'
import { getEvents, getEventsExtent, getTimelineCurrentDate } from '../state/selectors'
import { setDateTimeline } from '../state/actions'
import TimelineNavigationControlled, { TimelineTicks, TimelineEvents } from './TimelineNavigationControlled'

class TimelineNavigation extends PureComponent {
  onEventClicked = (event) => {
    this.props.setDateTimeline(event.startDate)
  }

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
            <TimelineEvents
              events={events}
              cy={height / 4}
              scale={scale}
              onClick={this.onEventClicked}
            />
            <TimelineTicks ticks={ticks} y={height / 4} scale={scale} />
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
