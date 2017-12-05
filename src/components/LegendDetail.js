import React, { PureComponent } from 'react'
import TopBar from './TopBar'

const fakeCover = "https://i2-prod.gazettelive.co.uk/incoming/article10966617.ece/ALTERNATES/s615/JS83871260.jpg"
const fakeHoverText = "Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula"
const fakeOffice = "Bureau de poste Fake"
const fakeAddress = "8, fake road, Paperopoli"

const PostOfficeInfo = ({ office = fakeOffice, address = fakeAddress }) => (
  <div className="w-100 p-3 bg-light" style={{minHeight: 250}}>
    <p className="font-12 mb-0">Office</p>
    <h3>{office}</h3>
    <p className="font-14 text-muted">
      <i className="material-icons font-12">place</i> {address}
    </p>
  </div>
)


class LegendDetail extends PureComponent {
  render () {
    const { cover = fakeCover, hoverText = fakeHoverText } = this.props
    return (
      <div className="d-flex flex-column flex-1">
        <div className="w-100 p-0 cover h-350px d-flex flex-column justify-content-end" style={{background:`url(${cover})`}}>
          <div className="w-100 bg-overlay text-white p-2">
            <div className="font-12 ml-3 mr-3">{hoverText}</div>
          </div>
        </div>
        <PostOfficeInfo />
        <div className="w-100 flex-1 p-3 bg-white font-14">
          <p>Nulla porttitor accumsan tincidunt. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;
            Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.
            Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Pellentesque in ipsum id orci porta dapibus.
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae</p>
        </div>
      </div>
    )
  }
}

export default LegendDetail
