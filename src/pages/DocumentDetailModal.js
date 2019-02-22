import React, { PureComponent } from 'react'
import { Motion, spring, TransitionMotion } from "react-motion"
import { connect } from 'react-redux'
import {
  getCollectionDocumentDetail,
} from '../state/selectors'
import {
  loadDocument,
  unloadDocument,
} from '../state/actions'
import DocDetail from '../components/DocDetail'

class DocumentDetailModal extends PureComponent {
  state = {
    closing: false,
  }

  componentDidMount() {
    this.props.loadDocument(this.props.match.params.id)
  }

  componentWillUnmount() {
    this.props.unloadDocument()
  }

  onClose = () => {
    this.setState({ closing: true })
  }

  render() {
    const { closing } = this.state
    const { doc } = this.props

    return (
      <TransitionMotion
        defaultStyles={
          !closing
            ? [
                {
                  key: "modal",
                  style: { o: 0 }
                }
              ]
            : []
        }
        styles={
          !closing
            ? [
                {
                  key: "modal",
                  style: { o: spring(1) }
                }
              ]
            : []
        }
        willLeave={() => ({ o: spring(0) })}
        willEnter={() => ({ o: 0 })}
        didLeave={() => {
          if (this.state.closing) {
            this.props.history.goBack()
          }
        }}
      >
        {interpolatedStyles => (
          <div>
            {interpolatedStyles.map(config => (
              <div key='doc-detail' style={{
                position: 'fixed',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 9999,
                opacity: config.style.o,
                height: '100%',
              }}>
                {doc && <DocDetail
                  doc={doc}
                  onClose={this.onClose}
                />}
              </div>
            ))}
          </div>
        )}
      </TransitionMotion>
    )
  }
}

export default connect((state, props) => ({
  doc: getCollectionDocumentDetail(props.match.params.id)(state),
}), {
  loadDocument,
  unloadDocument,
})(DocumentDetailModal)
