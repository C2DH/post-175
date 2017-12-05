import React, { PureComponent } from 'react'
import TopBar from './TopBar'

const ArrowsButtons = () => (
  <div className="d-flex flex-column">
    <button className="btn btn-light flex-1 rounded-0">
      <i className="material-icons">arrow_back</i>
    </button>
    <button className="btn btn-secondary flex-1 rounded-0">
      <i className="material-icons">arrow_forward</i>
    </button>
  </div>
)

class Period extends PureComponent {
  render () {
    const { cover="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbzF-Q2hYQg5ypy4TPq2sRrkAZz0VD95vfC8lV7JeW1KT8mlXU" } = this.props
    return (
      <div className="col-md-3 bg-info d-flex flex-column">
        <TopBar title={'TIMELINE'} />
        <div className="d-flex flex-column flex-1 justify-content-end cover" style={{background:`url(${cover})`}}>
          <div className="p-2 mb-3 text-light">
            <small>PERIODE</small>
            <h2 className="mb-3">1830-1880</h2>
            <p>Donec sollicitudin molestie malesuada. Quisque velit nisi, pretium ut lacinia in, elementum id enim. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Quisque velit nisi, pretium ut lacinia in, elementum id enim. Proin eget tortor risus.</p>
          </div>
          <div className="w-100 h-100px d-flex flex-row-reverse">
            <ArrowsButtons />
          </div>
        </div>
      </div>
    )
  }
}

export default Period
