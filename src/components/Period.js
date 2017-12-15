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
      o: 0
    }
  }

  periodWillLeave = () => {
    return {
      x: spring(-1000),
      o: spring(0, presets.stiff)
    }
  }

  getDefaultStyles = () => {
    return [{
      key: this.props.period ? this.props.period.id.toString() : '',
      style: {
        x: 1000,
        o: 0
      }
    }]
  }

  getStyles = () => {
    return [{
      key: this.props.period ? this.props.period.id.toString() : '',
      style: {
        x: spring(0),
        o: spring(1, presets.stiff)
      }
    }]
  }

  render () {
    const { period, nextPeriod, prevPeriod, style } = this.props
    const cover = get(period, 'documents[0].attachment')
    return (
      <div className="col-md-3 d-flex flex-column" style={style}>
        <TopBar title={'TIMELINE'} />
        <div className="d-flex flex-column flex-1 cover bg-info" style={{background:`url(${cover})`}}>

          <div className='flex-1 d-flex flex-column justify-content-end p-2'>


            {/* <small>PERIODE</small> */}
            <h1 className="mb-3 lead-48" style={{ position:'relative' }}>
            <TransitionMotion
              defaultStyles={this.getDefaultStyles()}
              styles={this.getStyles()}
              willLeave={this.periodWillLeave}
              willEnter={this.periodWillEnter}

              >

              {(styles)=><div style={{position:'relative'}}>{styles.map(config => (
                <div key={config.key} className="w-100"
                  // style={{transform:`translate(${config.style.x}px,0)`}}
                  style={{position:'absolute', bottom: 0, left:`${config.style.x}px`}}
                  >
                  {period.startDate.getFullYear()}{' - '}{period.endDate.getFullYear() + 1}
                </div>
              )

            )}</div>}

            </TransitionMotion>
            </h1>

          </div>
          <div className='flex-1' style={{ position: 'relative' }}>

            <TransitionMotion
              defaultStyles={this.getDefaultStyles()}
              styles={this.getStyles()}
              willLeave={this.periodWillLeave}
              willEnter={this.periodWillEnter}

              >
              {(styles)=><div style={{position:'relative'}}>{styles.map(config => {
                console.log(config)
                return (
                  <div style={{ position: 'absolute', top: 0, opacity: config.style.o }} key={config.key}>
                    <p>{period.data.description}</p>
                  </div>
                )
              }

            )}</div>}
              </TransitionMotion>
          </div>

          <div className="w-100 h-100px d-flex flex-row-reverse">
            <ArrowsButtons
              onNext={this.goNext}
              onPrev={this.goPrev}
              hasNext={nextPeriod !== null}
              hasPrev={prevPeriod !== null}
            />
          </div>

          {/* <div className="p-2 mb-3 text-light">
            <small>PERIODE</small>

            <h1 className="mb-3 lead-48">

            </h1>




            <div style={{ height: 300, overflowY: 'scroll' }}>
              <p>{period.data.description}</p>
            </div>
          </div>
          <div className="w-100 h-100px d-flex flex-row-reverse">
            <ArrowsButtons
              onNext={this.goNext}
              onPrev={this.goPrev}
              hasNext={nextPeriod !== null}
              hasPrev={prevPeriod !== null}
            />
          </div> */}
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
