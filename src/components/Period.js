import React, { PureComponent } from 'react'
import { get } from 'lodash'
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
import { TransitionMotion, spring, presets } from 'react-motion'

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

  state = {
    imageLoaded: false,
  }
  goNext = () => {
    const { setDateTimeline, nextPeriod } = this.props
    setDateTimeline(nextPeriod.startDate)
  }

  goPrev = () => {
    const { setDateTimeline, prevPeriod } = this.props
    setDateTimeline(prevPeriod.startDate)
  }

  periodWillEnter = () => {
    return {
      x: 1000,
    }
  }

  periodWillLeave = () => {
    return {
      x: spring(-1000),
    }
  }

  getDefaultStyles = () => {
    return [{
      key: this.props.period ? this.props.period.id.toString() : '',
      style: {
        x: 1000,
      },
      data: {
        period: this.props.period,
      }
    }]
  }

  getStyles = () => {
    return [{
      key: this.props.period ? this.props.period.id.toString() : '',
      style: {
        x: spring(0),
      },
      data: {
        period: this.props.period,
      }
    }]
  }

  imagesMap = {}

  componentDidMount() {
    this.preloadImage(this.props.period)
    this.mounted = true
  }

  componentWillUnmount() {
    this.mounted = false
  }

  preloadImage = period => {
    if (this.imagesMap[period.id] && this.imagesMap[period.id].complete) {
      return
    }
    this.setState({imageLoaded: false})
    const img = new Image()
    img.onload = () => {
      // Can sleep at night
      if (this.mounted) {
        this.setState({ imageLoaded: true })
      }
      this.imagesMap[period.id] = img
    }
    img.src = get(period, 'documents[0].attachment')
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.period && nextProps.period !== this.props.period) {
      this.preloadImage(nextProps.period)
    }
  }

  render () {
    const { period, nextPeriod, prevPeriod, style } = this.props
    const cover = this.state.imageLoaded ? get(period, 'documents[0].attachment') : get(period, 'documents[0].snapshot')
    return (
      <div className="col-md-3 d-flex flex-column" style={style}>
        <TopBar title={'TIMELINE'} />
        <div
          className="d-flex flex-column flex-1 cover period-cover"
          style={{backgroundImage:`linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(29,29,29,1) 90%),url(${cover})`}}
          >

          <div className='flex-1 d-flex flex-column justify-content-end px-4'>


            <small className='period-label'>PERIODE</small>
            <TransitionMotion
              defaultStyles={this.getDefaultStyles()}
              styles={this.getStyles()}
              willLeave={this.periodWillLeave}
              willEnter={this.periodWillEnter}

              >

              {(styles)=><div style={{position:'relative',height:60}}>{styles.map(config => (
                <div key={config.key} className="w-100 period-years p-0"
                  style={{position:'absolute', bottom: 0, left:`${config.style.x}px`}}
                  >
                  <h1 className="lead-48" style={{ position:'relative' }}>
                  {config.data.period.startDate.getFullYear()}{' - '}{config.data.period.endDate.getFullYear() + 1}
                  </h1>
                </div>
              )

            )}</div>}

            </TransitionMotion>

          </div>
          <div className='flex-1 px-4 overflow-auto' style={{ minHeight: 300 }}>

            <p className="period-description">{period.data.description}</p>
          </div>

          <div className="w-100 h-100px d-flex flex-row-reverse" style={{zIndex:10}}>
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
