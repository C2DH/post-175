import React from 'react'
import { Link } from 'react-router-dom'
import ZoomAndPanMedia from '../ZoomAndPanMedia'
import './DocDetail.css'

const DocDetail = ({ doc, onClose }) => (
  <div className='doc-detail'>
    <div className='doc-detail-data'>
      <div className='row w-100 m-0 h-100'>
        <div className='col-md-9 doc-detail-media'>
          <ZoomAndPanMedia
            src={doc.type === 'pdf' ? doc.snapshot : doc.attachment}
          />
        </div>
        <div className='col-md-3 doc-detail-info'>
          <div className='doc-date'>{doc.data.start_date}</div>
          <h3 className='doc-title'>{doc.data.title}</h3>
          <div className='doc-description'>
            <p>{doc.data.description}</p>
          </div>
          <div className='doc-related-docs-container'>
            <div className='doc-related-docs-title'>Related documents</div>
            <div className='doc-related-docs row p-0'>
              {doc.documents.map(relatedDoc => (
                <div className='col-md-4 p-0 doc-related-doc' key={relatedDoc.id}>
                  <Link to={`/doc/${relatedDoc.id}`}>
                    <img src={relatedDoc.snapshot} alt={relatedDoc.title} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className='doc-detail-bar'>
      <div className='close-icon' onClick={onClose}>X</div>
      <div>D</div>
    </div>
  </div>
)

export default DocDetail
