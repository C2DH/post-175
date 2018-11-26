import React, { PureComponent } from 'react'
import classNames from 'classnames'
import CollectionItem from './CollectionItem'
import './Collection.css'

export default class CollectionList extends PureComponent {
  render() {
    const { docs } = this.props
    return (
      <div className='collection-list'>
        <div className='row collection-row'>
          {docs.map(doc => (
            <div key={doc.id} className={classNames(`col-md-${doc.large ? 4 : 3} collection-col`, {
              'bg-danger': doc.large,
            })}>
              <CollectionItem doc={doc} />
            </div>
          ))}
        </div>
      </div>
    )
  }
}
