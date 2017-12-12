import React, { PureComponent } from 'react'
import { find, head, get } from 'lodash'
import { getEventColor } from '../utils'

const CloseBtn = ({onClose}) => (
  <div className="position-fixed pt-3 pr-3" style={{top: 0, right:0}}>
    <button onClick={onClose} className="btn text-white rounded-0 d-flex justify-content-center" style={{backgroundColor: 'transparent'}}>
      <i className="material-icons">close</i>
    </button>
  </div>
)

const EventType = ({ event }) => {
  const color = getEventColor(event)
  return (
    <div className="d-inline-flex">
      <svg width={20} height={20}>
        <circle cx="10" cy="10" r={8} fill={color} />
      </svg>
      <span className="font-12" style={{color: color, paddingTop: 2}}>{event.data.category_label}</span>
    </div>
  )
}

const EventsControl = ({hasPrev, hasNext, goNext, goPrev}) => (
  <div className="w-100 d-inline-flex justify-content-between">
    <div
      className="p1 d-inline-flex event-modal-control pointer"
      onClick={goPrev}
      style={!hasPrev ? {pointerEvents: 'none', opacity: 0.8} : undefined}
      >
      <i className="material-icons">arrow_back</i>
      <span className="pb-2 ml-2">Previous event</span>
    </div>
    <div
      className="p1 d-inline-flex event-modal-control pointer"
      onClick={goNext}
      style={!hasNext ? {pointerEvents: 'none', opacity: 0.8} : undefined}
      >
      <span className="pb-2 mr-2">Next event</span>
      <i className="material-icons">arrow_forward</i>
    </div>
  </div>
)

class EventModal extends PureComponent {
  state = {
    selectedDocument : null,
  }

  componentWillReceiveProps(nextProps)  {
    if (this.props.event !== nextProps.event) {
      this.setState({ selectedDocument: null })
    }
  }

  handleSelectDocument = (selectedDocument)=> () => {
    this.setState({selectedDocument})
  }

  render() {
    const { event, onClose, hasPrev, hasNext, goNext, goPrev } = this.props

    // Take only docs \w snapshot
    const displayDocs = event.documents.filter(d => d.snapshot)
    const selectedDocument = this.state.selectedDocument
      ? this.state.selectedDocument
      : head(displayDocs)

    return (
      <div className="bg-black p-3 fixed-top fixed-bottom">
        <div className="container h-100 d-flex text-dark">
          <div className="flex-1 h-100 bg-white d-flex flex-column">
            <div className="flex-1 bg-light p-1">
              <EventType event={event} />
              <div className="w-100 pl-3 pr-3">
                <h2 style={{fontSize: 28}}>{event.data.title}</h2>
                <p className="font-12">{event.data.start_date}</p>
              </div>
            </div>
            <div className="p-3 mt-3 overflow-auto" style={{flex: 2}}>
              <p>{event.data.description}</p>
            </div>
            <EventsControl
              hasNext={hasNext}
              hasPrev={hasPrev}
              goNext={goNext}
              goPrev={goPrev}
            />
          </div>
          <div className="h-100 flex-column d-flex" style={{flex: 2.55, backgroundColor: '#313030'}}>
            <div className="w-100 text-white pl-3 pr-3 d-flex align-items-center" style={{height: 60}}>
              <div style={{lineHeight: 1}}>
                <span className="text-muted font-12">MEDIA</span><br />
                <span className="text-white font-12">{get(selectedDocument, 'title')}</span><br/>
                <span style={{fontSize: 10}} className="text-white"></span>
              </div>
            </div>
            <div className="w-100 flex-1 d-flex">
              <div className="h-100 p-3 d-flex justify-content-center flex-column overflow-auto" style={{flex: 4.5}}>
                {selectedDocument && <img className="img-fluid pt-3" src={selectedDocument.attachment} />}
              </div>
              <div className="flex-1 h-100 p-1 pr-3 flex-column overflow-auto">
                {displayDocs && displayDocs.map((doc, i) => (
                  <img
                    key={doc.id}
                    src={doc.snapshot}
                    className="img-fluid mt-1 mb-1 grayscale pointer"
                    onClick={this.handleSelectDocument(doc)}
                    style={(doc.id === selectedDocument.id) ? {border: '1px solid red', filter: 'none'} : null}
                   />
                ))}
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
