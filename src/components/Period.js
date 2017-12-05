import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  getTimelineCurrentPeriod,
  getTimelineNextPeriod,
  getTimelinePrevPeriod,
} from '../state/selectors'
import {
  setDateTimeline,
} from '../state/actions'
import TopBar from './TopBar'

const ArrowsButtons = ({ hasNext, hasPrev, onNext, onPrev }) => (
  <div className="d-flex flex-column">
    <button
      onClick={onPrev}
      className="btn btn-light flex-1 rounded-0"
      disabled={!hasPrev}>
      <i className="material-icons">arrow_back</i>
    </button>
    <button
      onClick={onNext}
      className="btn btn-light flex-1 rounded-0"
      disabled={!hasNext}>
      <i className="material-icons">arrow_forward</i>
    </button>
  </div>
)

class Period extends PureComponent {
  goNext = () => {
    const { setDateTimeline, nextPeriod } = this.props
    setDateTimeline(nextPeriod.startDate)
  }

  goPrev = () => {
    const { setDateTimeline, prevPeriod } = this.props
    setDateTimeline(prevPeriod.startDate)
  }

  render () {
    const { period, nextPeriod, prevPeriod, cover="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbzF-Q2hYQg5ypy4TPq2sRrkAZz0VD95vfC8lV7JeW1KT8mlXU" } = this.props
    return (
      <div className="col-md-3 bg-info d-flex flex-column">
        <TopBar title={'TIMELINE'} />
        <div className="d-flex flex-column flex-1 justify-content-end cover" style={{background:`url(${cover})`}}>
          <div className="p-2 mb-3 text-light">
            <small>PERIODE</small>
            <h2 className="mb-3">{period.startDate.getFullYear()}{' - '}{period.endDate.getFullYear() + 1}</h2>
            <p>{period.data.description || '....'}</p>
          </div>
          <div className="w-100 h-100px d-flex flex-row-reverse">
            <ArrowsButtons
              onNext={this.goNext}
              onPrev={this.goPrev}
              hasNext={nextPeriod !== null}
              hasPrev={prevPeriod !== null}
            />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  period: getTimelineCurrentPeriod(state),
  nextPeriod: getTimelineNextPeriod(state),
  prevPeriod: getTimelinePrevPeriod(state),
})
export default connect(mapStateToProps, {
  setDateTimeline,
})(Period)
