import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { getPlacesExtent, getMapTimelineCurrentDate } from '../state/selectors'
import { setDateTimelineMap } from '../state/actions'
import TimelineNavigationControlled, { TimelineTicks } from './TimelineNavigationControlled'

class TimelineNavigationMap extends PureComponent {
  render() {
    const { extent, currentDate, setDateTimelineMap } = this.props

    return (
      <TimelineNavigationControlled
        currentDate={currentDate}
        onDateChange={setDateTimelineMap}
        extent={extent}
        style={{ height: 50 }}
      >
        {({ width, height, scale, ticks }) => (
          <TimelineTicks ticks={ticks} y={height / 2} scale={scale} />
        )}
      </TimelineNavigationControlled>
    )
  }
}

const mapStateToProps = state => ({
  currentDate: getMapTimelineCurrentDate(state),
  extent: getPlacesExtent(state),
})
export default connect(mapStateToProps, {
  setDateTimelineMap,
})(TimelineNavigationMap)
