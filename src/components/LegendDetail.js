import React, { PureComponent } from 'react'
import TopBar from './TopBar'

const PostOfficeInfo = ({ office = fakeOffice, address = fakeAddress }) => (
  <div className="w-100 p-3 bg-light" style={{minHeight: 250}}>
    <p className="font-12 mb-0">Office</p>
    <h3>{office}</h3>
    <p className="font-14 text-muted">
      <i className="material-icons font-12">place</i> {address}
    </p>
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
        <div className="w-100 p-0 cover legend-detail-image d-flex flex-column justify-content-end" style={{background:`url(${cover})`}}>
          <div className="w-100 bg-overlay text-white d-flex flex-row">
            <div className="font-12 m-3">{hoverText}</div>
            <CoversButtons />
          </div>
        </div>
        <PostOfficeInfo />
        <div className="w-100 flex-1 p-3 bg-white font-14">
          <p>Nulla porttitor accumsan tincidunt. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;
            Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.
            Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Pellentesque in ipsum id orci porta dapibus.
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae</p>
        </div>
        <div className="w-100 p-0 cover legend-detail-image" style={{background:`url(${image})`}} />
      </div>
    )
  }
}

export default LegendDetail
