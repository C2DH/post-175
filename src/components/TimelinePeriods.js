import React, { PureComponent, Fragment } from 'react'
import classNames from 'classnames'

const PERIODS_HEIGHT = 30

class PeriodBox extends PureComponent {
  render() {
    const { scale, period, width, isFirst, isLast, currentDate, onClick } = this.props
    const startX = isFirst ? 0 : scale(period.startDate)
    const endX = isLast ? width : scale(period.endDate)
    const periodWidth = endX - startX
    const hovered = (
      currentDate.getFullYear() >= period.startDate.getFullYear() &&
      currentDate.getFullYear() <= period.endDate.getFullYear()
    )

    return (
      <div
        onClick={e => onClick(period, startX, endX, e)}
        className={classNames('period-box h-100', {
            hovered,
        })}
        style={{ width: periodWidth }}
      >
        {period.startDate.getFullYear()} - {period.endDate.getFullYear() + 1}
      </div>
    )
  }
}

class PopUpPeriod extends PureComponent {
  componentDidMount() {
    document.body.addEventListener('click', this.handleClickDismiss)
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.handleClickDismiss)
  }

  handleClickDismiss = (e) => {
    // Avoid dismiss when click on period box...
    // i know this is a workaround....
    if (e.target.classList.contains('period-box')) {
      return
    }
    const rect = this.popupContainer.getBoundingClientRect()
    // Skip dismiss when click on current element bounds...
    // another special workaround ...
    // thanks to old school 2D platform Mario smashing shit
    if (
      e.clientX >= rect.left &&
      e.clientX <= (rect.left + rect.width) &&
      e.clientY >= rect.top &&
      e.clientY <= (rect.top + rect.height)
    ) {
      return
    }
    this.props.onDismiss()
  }

  render() {
    const { period, bottom, startX, endX, containerWidth } = this.props
    const offsetBottom = 20
    const popUpWidth = 340
    const popUpHeight = 280

    const periodCenter = startX + parseInt(((endX - startX) / 2), 10)
    const minLeft = 10
    const maxLeft = containerWidth - popUpWidth - 10
    let left = periodCenter - parseInt((popUpWidth / 2))
    left = Math.max(left, minLeft)
    left = Math.min(left, maxLeft)

    const pinOffest = 5
    const pinLeft = periodCenter

    return (
      <Fragment>
        <div
          ref={r => this.popupContainer = r}
          className='bg-white p-3 d-flex flex-column align-items-center'
          style={{
            position: 'absolute',
            bottom: bottom + offsetBottom,
            height: popUpHeight,
            width: popUpWidth,
            left,
            // border: '2px solid crimson'
         }}>
          <h1>
            {period.startDate.getFullYear()}{' - '}{period.endDate.getFullYear() + 1}
          </h1>
          <p className='font-12'>
            {period.data.description}
          </p>
        </div>
        <div style={{
          position: 'absolute',
          bottom: bottom + pinOffest,
          height: offsetBottom - pinOffest,
          border: '1px solid white',
          left: pinLeft,
        }} />
      </Fragment>
    )
  }
}

export default class TimelinePeriods extends PureComponent {
  state = {
    showPopupPeriod: null,
  }

  handleDismissPopup = () => {
    this.setState({
      showPopupPeriod: null,
    })
  }

  handleOnPeriodClick = (period, startX, endX, e) => {
    this.setState(prevState => {
      const prevPeriod = prevState.showPopupPeriod
        ? prevState.showPopupPeriod.period
        : null

      if (prevPeriod && prevPeriod === period) {
        return {
          showPopupPeriod: null,
        }
      }

      return {
        showPopupPeriod: {
          period,
          startX,
          endX,
        },
      }
    })
  }

  render() {
    const { scale, height, width, periods, currentDate } = this.props
    const { showPopupPeriod } = this.state
    return (
      <div
        style={{ height, width, position: 'relative' }}
        className='d-flex bg-white'>

        {showPopupPeriod && <PopUpPeriod
          scale={scale}
          bottom={height}
          containerWidth={width}
          {...showPopupPeriod}
          onDismiss={this.handleDismissPopup}
        />}

        {periods.map((period, i) => (
          <PeriodBox
            onClick={this.handleOnPeriodClick}
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
