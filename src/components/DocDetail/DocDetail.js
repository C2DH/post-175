import React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { getLangs, getSelectedLang, getMakeLangUrl } from '../../state/selectors'
import DocMedia from './DocMedia'
import './DocDetail.css'

const DocDetail = ({ doc, onClose, langs, selectedLang, url, location, history }) => (
  <div className='doc-detail'>
    <div className='doc-detail-bar'>
      <div className='close-icon' onClick={onClose}>{'←'}</div>
      <div className='w-100'>
        <div className='pointer text-center' onClick={() => {
          alert('Download')
        }}>{'↓'}</div>
        <div className='doc-detail-lang-switcher'>
          {langs.map(lang => (
            <div
              onClick={() => {
                const currentUrl = location.pathname + location.search
                history.push(url(currentUrl, lang.param))
              }}
              key={lang.code}
              className={classNames('doc-detail-lang', {
                'doc-detail-current-lang': lang.code === selectedLang.code,
              })}>
              {lang.param}
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className='doc-detail-data'>
      <div className='row w-100 m-0 h-100'>
        <div className='col-md-4 doc-detail-info'>
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
        <div className='col-md-8'>
          <DocMedia doc={doc} />
        </div>
      </div>
    </div>
  </div>
)

export default withRouter(connect(state => ({
  url: getMakeLangUrl(state),
  langs: getLangs(state),
  selectedLang: getSelectedLang(state),
}))(DocDetail))
