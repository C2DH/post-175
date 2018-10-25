import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import memoize from 'memoize-one'
import find from 'lodash/find'
import {
  getCollectionDocuments,
} from '../state/selectors'
import DocDetail from '../components/DocDetail'

class DocumentDetailModal extends PureComponent {
  getDocument = memoize((documents, id) => {
    return find(documents, { id: +id })
  })

  onClose = () => {
    this.props.history.goBack()
  }

  render() {
    const { documents, match } = this.props
    const { params: { id } } = match
    const doc = this.getDocument(documents, id)

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
      }}>
        {doc && <DocDetail
          doc={doc}
          onClose={this.onClose}
        />}
      </div>
    )
  }
}

export default connect(state => ({
  documents: getCollectionDocuments(state),
}))(DocumentDetailModal)
