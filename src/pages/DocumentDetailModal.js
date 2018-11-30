import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import find from 'lodash/find'
import {
  getCollectionDocumentDetail,
} from '../state/selectors'
import {
  loadDocument,
  unloadDocument,
} from '../state/actions'
import DocDetail from '../components/DocDetail'
import SideMenu from '../components/SideMenu'

class DocumentDetailModal extends PureComponent {
  componentDidMount() {
    this.props.loadDocument(this.props.doc.id)
  }

  componentWillUnmount() {
    this.props.unloadDocument()
  }

  onClose = () => {
    this.props.history.goBack()
  }

  render() {
    const { doc } = this.props

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
      }}>
        <SideMenu />
        <div className='with-sidemenu h-100'>
          {doc && <DocDetail
            doc={doc}
            onClose={this.onClose}
          />}
        </div>
      </div>
    )
  }
}

export default connect((state, props) => ({
  doc: getCollectionDocumentDetail(props.match.params.id)(state),
}), {
  loadDocument,
  unloadDocument,
})(DocumentDetailModal)
