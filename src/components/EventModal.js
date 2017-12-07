import React, { PureComponent } from 'react'

const CloseBtn = ({onclick}) => (
  <div className="position-fixed pt-3 pr-3" style={{top: 0, right:0}}>
    <button className="btn text-white rounded-0 d-flex justify-content-center" style={{backgroundColor: 'transparent'}} onClick={onclick}>
      <i className="material-icons">close</i>
    </button>
  </div>
)


class EventModal extends PureComponent {
  render() {
    return (
      <div className="bg-black p-3 fixed-top fixed-bottom">
        <div className="container h-100 d-flex">
          <div className="flex-1 h-100 bg-white">
          </div>
          <div className="h-100 flex-column d-flex" style={{flex: 2.55, backgroundColor: '#313030'}}>
            <div className="w-100 bg-info" style={{height: 57}}>
            </div>
            <div className="w-100 bg-warning flex-1 d-flex">
              <div className="bg-warning h-100" style={{flex: 4.5}}>

              </div>
              <div className="flex-1 bg-success h-100">

              </div>
            </div>
          </div>
        </div>
        <CloseBtn />
      </div>
    )
  }
}

export default EventModal
