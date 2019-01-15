import React, { Component } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import './PdfViewer.scss'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

export default class PdfViewer extends Component {
  state = {
    height: null,
    pageNumber: 1,
    numPages: null,
  }

  componentDidMount() {
    if (this.container) {
      this.setState({
        height: this.container.offsetHeight,
      })
    }
  }

  handlePageChange = e => {
    const { numPages } = this.state
    const pageNumber = e.target.value
    if (+pageNumber <= numPages) {
      this.setState({ pageNumber })
    }
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages })
  }

  render() {
    const { file } = this.props
    const { height, numPages, pageNumber } = this.state
    // console.log(height)
    return (
      <div className='pdf-viewer'>
        <div className='pdf-container' ref={r => this.container = r}>
          {height && <Document
            height={height}
            onLoadSuccess={this.onDocumentLoadSuccess}
            file={file}
           >
            <Page
              height={height}
              pageNumber={pageNumber ? +pageNumber : 1}
            />
          </Document>}
        </div>
        <div className='pdf-controls'>
          <div>
            <button
              onClick={() => this.setState({
                pageNumber: pageNumber - 1,
              })}
              disabled={pageNumber <= 1}
              className='page-arrow arrow-back'>{'←'}</button>
            <input
              className='page-input'
              type='number'
              onChange={this.handlePageChange}
              value={pageNumber}
            />
            {' of '}
            {numPages}
            <button
              onClick={() => this.setState({
                pageNumber: pageNumber + 1,
              })}
              disabled={pageNumber >= numPages}
              className='page-arrow arrow-next'>{'→'}</button>
          </div>
        </div>
      </div>
    )
  }
}
