import React, { PureComponent } from 'react'
import CollectionItem from './CollectionItem'
import './Collection.css'

export default class CollectionList extends PureComponent {
  render() {
    const { docs } = this.props
    return (
      <div className='collection-list'>
        <div className='row collection-row'>
          {docs.map(doc => (
            <div key={doc.id} className='col-md-3 collection-col'>
              <CollectionItem doc={doc} />
            </div>
          ))}
        </div>
      </div>
    )
  }
}
