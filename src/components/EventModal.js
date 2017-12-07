import React, { PureComponent } from 'react'

const CloseBtn = ({onClose}) => (
  <div className="position-fixed pt-3 pr-3" style={{top: 0, right:0}}>
    <button onClick={onClose} className="btn text-white rounded-0 d-flex justify-content-center" style={{backgroundColor: 'transparent'}}>
      <i className="material-icons">close</i>
    </button>
  </div>
)

const EventType = ({eventColor, eventType}) => (
  <div className="d-inline-flex">
    <svg width={30} height={25}>
      <circle cx="10" cy="10" r={9} fill={eventColor} />
    </svg>
    <span className="font-12 text-capitalize" style={{color: eventColor}}>{eventType}</span>
  </div>
)

const EventsControl = ({hasPrev, hasNext, goNext, goPrev}) => (
  <div className="w-100 d-inline-flex justify-content-between">
    <div
      className="p1 d-inline-flex event-modal-control"
      onClick={goPrev}
      style={!hasPrev ? {poiterEvents: 'none', color: '#fff'} : undefined}
      >
      <i className="material-icons">arrow_back</i>
      <span className="pb-2 ml-2">Previous event</span>
    </div>
    <div
      className="p1 d-inline-flex event-modal-control"
      onClick={goNext}
      style={!hasNext ? {poiterEvents: 'none', color: '#fff'} : undefined}
      >
      <span className="pb-2 mr-2">Next event</span>
      <i className="material-icons">arrow_forward</i>
    </div>
  </div>
)

class EventModal extends PureComponent {
  render() {
    const { event, onClose, hasPrev, hasNext, goNext, goPrev } = this.props
    return (
      <div className="bg-black p-3 fixed-top fixed-bottom">
        <div className="container h-100 d-flex text-dark">
          <div className="flex-1 h-100 bg-white d-flex flex-column">
            <div className="flex-1 bg-light p-1">
              <EventType eventColor="green" eventType={event.data.category} />
              <div className="w-100 pl-3 pr-3">
                <h2 style={{fontSize: 28}}>{event.data.title}</h2>
                <p className="font-12">{event.data.start_date}</p>
              </div>
            </div>
            <div className="p-3 mt-3 overflow-auto" style={{flex: 2}}>
              <p>{event.data.description}</p>
            </div>
            {/* <div className="culo w-100 d-inline-flex justify-content-between">
              <div className="pl-1 pb-1 d-inline-flex">
                <i className="material-icons">arrow_back</i>
                <span className="pb-2 ml-2">Previous event</span>
              </div>
              <div className="pr-1 pb-1 d-inline-flex">
                <span className="pb-2 mr-2">Next event</span>
                <i className="material-icons">arrow_forward</i>
              </div>
            </div> */}
            <EventsControl
              hasNext={hasNext}
              hasPrev={hasPrev}
              goNext={goNext}
              goPrev={goPrev}
            />
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
        <CloseBtn onClose={onClose} />
      </div>
    )
  }
}

export default EventModal
