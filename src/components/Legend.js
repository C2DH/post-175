import React, { PureComponent } from 'react'
import TopBar from './TopBar'

class Legend extends PureComponent {
  render () {
    return (
      <div className="col-md-3 bg-info d-flex flex-column">
        <TopBar title={'MAP'} />
        <div className="d-flex flex-column flex-1">
          <div className="d-flex flex-row flex-1">
            
            <small>PERIODE</small>
            <h2 className="mb-3">1830-1880</h2>
            <p>Donec sollicitudin molestie malesuada. Quisque velit nisi, pretium ut lacinia in, elementum id enim. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Quisque velit nisi, pretium ut lacinia in, elementum id enim. Proin eget tortor risus.</p>
          </div>
        </div>
      </div>

    )
  }
}

export default Legend
