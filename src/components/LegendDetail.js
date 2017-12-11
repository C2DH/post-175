import React, { PureComponent } from 'react'
import PlaceOpeningTimeline from './PlaceOpeningTimeline'

const PostOfficeInfo = ({ office , address, openDate, closeDate  }) => (
  <div className="w-100 p-3 bg-light" style={{minHeight: 250}}>
    <p className="font-12 mb-0">Office</p>
    <h3>{office}</h3>
    <p className="font-14 text-muted">
      <i className="material-icons font-12">place</i> {address}
    </p>
    <div className='w-100'>
      <PlaceOpeningTimeline openDate={openDate} closeDate={closeDate} />
    </div>
  </div>
)

const CoversButtons = () => (
  <div className="d-flex flex-row align-self-end bg-white" style={{height: 36}}>
    <button className="btn btn-light flex-1 rounded-0 d-flex justify-content-center">
      <i className="material-icons font-14">arrow_back</i>
    </button>
    <button className="btn btn-light flex-1 rounded-0 d-flex justify-content-center">
      <i className="material-icons font-14">arrow_forward</i>
    </button>
  </div>
)

class LegendDetail extends PureComponent {
  render () {
    const { place } = this.props
    return (
      <div className="d-flex flex-column h-100 overflow-auto">
        <div className="w-100 p-0 cover legend-detail-image d-flex flex-column justify-content-end" >
          <div className="w-100 bg-overlay text-white d-flex flex-row justify-content-between">
            <div className="font-12 m-3">{place.title}</div>
            <CoversButtons />
          </div>
        </div>
        <PostOfficeInfo
          address={place.data.address}
          office={place.data.title}
          openDate={place.startDate}
          closeDate={place.endDate}
        />
        <div className="w-100 flex-1 p-3 bg-white font-14">
          <p>{place.data.description}</p>
        </div>
        <div className="w-100 p-0 cover legend-detail-image" />
      </div>
    )
  }
}

export default LegendDetail
