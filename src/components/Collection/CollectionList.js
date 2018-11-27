import React, { PureComponent } from 'react'
import classNames from 'classnames'
import CollectionItem from './CollectionItem'
import './Collection.css'

export default class CollectionList extends PureComponent {
  render() {
    const { docs } = this.props
    return (
      <div className='collection-list'>
        <div className='collection-list-wrapper'>
          {docs.map((docRow, i) => (
            <div className='row no-gutters collection-row' key={i}>
              {docRow.map(doc => (
                <div key={doc.id} className={classNames(`collection-col`, {
                  'col': docRow.length === 6,
                  'col-2': docRow.length === 5 && !doc.large,
                  'col-4': docRow.length === 5 && doc.large,
                  'col-placeholder': doc.placeholder,
                })}>
                  {doc.placeholder ? <div /> : <CollectionItem doc={doc} />}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }
}
