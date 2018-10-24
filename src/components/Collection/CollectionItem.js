import React, { PureComponent } from 'react'
import MagikDotDotDot from '../MagikDotDotDot'
import './Collection.css'

export default class CollectionItem extends PureComponent {
  render() {
    const { doc } = this.props
    return (
      <div className='collection-item'>
        <div className='item-image-box'>
          <img src={doc.snapshot} alt={doc.title} />
        </div>
        <div className='item-caption'>
          <div className='item-label'>
            {/* Fuck off multiline ellipsis use dot dot dot */}
            <MagikDotDotDot clamp={2}>
              {doc.data.title}
            </MagikDotDotDot>
          </div>
          <div className='item-year'>{doc.data.year}</div>
        </div>
      </div>
    )
  }
}
