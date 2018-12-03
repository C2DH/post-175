import React, { PureComponent } from 'react'
import get from 'lodash/get'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import MagikDotDotDot from '../MagikDotDotDot'
import './Collection.css'

export default class CollectionItem extends PureComponent {
  render() {
    const { doc } = this.props
    return (
      <Link to={{ pathname: `/doc/${doc.id}`, state: { modal: true } }}>
        <div className='collection-item'>
          <div className='item-caption'>
            <div className='item-year'>{doc.data.year}</div>
            <div className='item-label'>
              {/* Fuck off multiline ellipsis use dot dot dot */}
              <MagikDotDotDot clamp={2}>
                {doc.data.title}
              </MagikDotDotDot>
            </div>
          </div>
          <div className={classNames('item-image-box', {
            'item-image-large': doc.large,
          })}>
            <img src={get(doc, 'data.resolutions.medium.url', doc.snapshot)} alt={doc.title} />
          </div>
        </div>
      </Link>
    )
  }
}
