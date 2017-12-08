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
import { TransitionMotion, spring } from 'react-motion'

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

  periodWillEnter = () => {
    return { x: 1000 }
  }

  periodWillLeave = () => {
    return { x: spring(-1000) }
  }

  getDefaultStyles = () => {
    return [{
      key: this.props.period ? this.props.period.id.toString() : '',
      style: { x: 1000 }
    }]
  }

  getStyles = () => {
    return [{
      key: this.props.period ? this.props.period.id.toString() : '',
      style: { x: spring(0) }
    }]
  }

  render () {
    const { period, nextPeriod, prevPeriod, style,
      cover="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbzF-Q2hYQg5ypy4TPq2sRrkAZz0VD95vfC8lV7JeW1KT8mlXU" } = this.props
    return (
      <div className="col-md-3 bg-info d-flex flex-column" style={style}>
        <TopBar title={'TIMELINE'} />
        <div className="d-flex flex-column flex-1 justify-content-end cover" style={{background:`url(${cover})`}}>
          <div className="p-2 mb-3 text-light">
            <small>PERIODE</small>
            <h1 className="mb-3 lead-48">
            <TransitionMotion
              defaultStyles={this.getDefaultStyles()}
              styles={this.getStyles()}
              willLeave={this.periodWillLeave}
              willEnter={this.periodWillEnter}

              >

              {(styles)=><div style={{position:'relative'}}>{styles.map(config => (
                <div key={config.key} className="w-100"
                  // style={{transform:`translate(${config.style.x}px,0)`}}
                  style={{position:'absolute', left:`${config.style.x}px`}}
                  >
                  {period.startDate.getFullYear()}{' - '}{period.endDate.getFullYear() + 1}
                </div>
              )

            )}</div>}

            </TransitionMotion>
            </h1>



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
