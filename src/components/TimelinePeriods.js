import React, { PureComponent } from 'react'
import classNames from 'classnames'

const PERIODS_HEIGHT = 30

class PeriodBox extends PureComponent {
  render() {
    const { scale, period, width, isFirst, isLast, currentDate } = this.props
    const startPos = isFirst ? 0 : scale(period.startDate)
    const endPos = isLast ? width : scale(period.endDate)
    const periodWidth = endPos - startPos
    const hovered = (
      currentDate.getFullYear() >= period.startDate.getFullYear() &&
      currentDate.getFullYear() <= period.endDate.getFullYear()
    )

    return (
      <div className={classNames('period-box h-100', {
        hovered,
      })} style={{ width: periodWidth }}>
        {period.startDate.getFullYear()} - {period.endDate.getFullYear()}
      </div>
    )
  }
}

export default class TimelinePeriods extends PureComponent {
  render() {
    const { scale, height, width, periods, currentDate } = this.props
    return (
      <div style={{ height, width }} className='d-flex bg-white'>
        {periods.map((period, i) => (
          <PeriodBox
            currentDate={currentDate}
            isFirst={i === 0}
            isLast={i === periods.length - 1}
            period={period}
            key={period.id}
            width={width}
            scale={scale}
          />
        ))}
      </div>
    )
  }
}

TimelinePeriods.defaultProps = {
  height: PERIODS_HEIGHT,
}
