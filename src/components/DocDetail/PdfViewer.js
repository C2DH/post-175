import React, { Component } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "./PdfViewer.scss";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${
  pdfjs.version
}/pdf.worker.js`;

export default class PdfViewer extends Component {
  state = {
    height: null,
    pageNumber: 1,
    numPages: null
  };

  componentDidMount() {
    if (this.container) {
      this.setState({
        height: this.container.offsetHeight
      });
    }
  }

  handlePageChange = e => {
    const { numPages } = this.state;
    const pageNumber = e.target.value;
    if (+pageNumber <= numPages) {
      this.setState({ pageNumber });
    }
  };

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  render() {
    const { file } = this.props;
    const { height, numPages, pageNumber } = this.state;
    // console.log(height)
    return (
      <div className="pdf-viewer">
        <div
          className="pdf-container text-white m-3"
          ref={r => (this.container = r)}
        >
          {height && (
            <Document
              height={height}
              onLoadSuccess={this.onDocumentLoadSuccess}
              file={file}
              loading="Loading..."
            >
              <Page height={height} pageNumber={pageNumber ? +pageNumber : 1} />
            </Document>
          )}
        </div>
        <div className="pdf-controls p-3">
          <button
            onClick={() =>
              this.setState({
                pageNumber: pageNumber - 1
              })
            }
            disabled={pageNumber <= 1}
            className="btn btn-dark bg-transparent mr-2"
          >
            {"←"}
          </button>
          <input
            className="page-input mr-2"
            type="number"
            onChange={this.handlePageChange}
            value={pageNumber}
            min="1"
            max="numPages"
          />
          {" of "}
          {numPages}
          <button
            onClick={() =>
              this.setState({
                pageNumber: pageNumber + 1
              })
            }
            disabled={pageNumber >= numPages}
            className="btn btn-dark bg-transparent ml-2"
          >
            {"→"}
          </button>
        </div>
      </div>
    );
  }
}
