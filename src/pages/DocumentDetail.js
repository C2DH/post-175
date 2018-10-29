import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  getDocDetail
} from '../state/selectors'
import {
  loadDocument,
  unloadDocument,
} from '../state/actions'
import DocDetail from '../components/DocDetail'
import SideMenu from '../components/SideMenu'

class DocumentDetail extends PureComponent {
  componentDidMount() {
    const { match } = this.props
    const { params: { id } } = match
    this.props.loadDocument(id)
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.props.unloadDocument()
      this.props.loadDocument(this.props.match.params.id)
    }
  }

  componentWillUnmount() {
    this.props.unloadDocument()
  }

  onClose = () => {
    this.props.history.push(`/collection`)
  }

  render() {
    const { doc } = this.props

    return (
      <div className='h-100'>
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

export default connect(state => ({
  doc: getDocDetail(state),
}), {
  loadDocument,
  unloadDocument,
})(DocumentDetail)
