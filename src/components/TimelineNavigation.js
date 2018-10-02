import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux'
import { getEvents, getPeriodsExtent, getTimelineCurrentDate, getPeriods } from '../state/selectors'
import { setDateTimeline } from '../state/actions'
import TimelineNavigationControlled, { TimelineTicks, TimelineEvents } from './TimelineNavigationControlled'
import TimelinePeriods from './TimelinePeriods'

class TimelineNavigation extends PureComponent {
  onEventClicked = (event) => {
    this.props.setDateTimeline(event.startDate)
  }

  render() {
    const { extent, events, periods, currentDate, setDateTimeline } = this.props
    return (
      <TimelineNavigationControlled
        className='align-self-end'
        currentDate={currentDate}
        onDateChange={setDateTimeline}
        extent={extent}
        renderTop={({ width, scale }) => (
          <TimelinePeriods
            width={width}
            scale={scale}
            periods={periods}
            currentDate={currentDate}
          />
        )}
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
  periods: getPeriods(state),
  extent: getPeriodsExtent(state),
})
export default connect(mapStateToProps, {
  setDateTimeline,
})(TimelineNavigation)
