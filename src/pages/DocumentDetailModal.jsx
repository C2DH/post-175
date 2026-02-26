import React, { useEffect, useState } from 'react'
import { Motion, spring, TransitionMotion } from 'react-motion'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { getCollectionDocumentDetail } from '../state/selectors'
import { loadDocument, unloadDocument } from '../state/actions'
import DocDetail from '../components/DocDetail'

const DocumentDetailModal = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [closing, setClosing] = useState(false)
  const doc = useSelector((state) => getCollectionDocumentDetail(id)(state))

  useEffect(() => {
    if (id) dispatch(loadDocument(id))
    return () => dispatch(unloadDocument())
  }, [dispatch, id])

  const onClose = () => {
    setClosing(true)
  }

  return (
    <TransitionMotion
      defaultStyles={
        !closing
          ? [
              {
                key: 'modal',
                style: { o: 0 },
              },
            ]
          : []
      }
      styles={
        !closing
          ? [
              {
                key: 'modal',
                style: { o: spring(1) },
              },
            ]
          : []
      }
      willLeave={() => ({ o: spring(0) })}
      willEnter={() => ({ o: 0 })}
      didLeave={() => {
        if (closing) {
          navigate(-1)
        }
      }}
    >
      {(interpolatedStyles) => (
        <div>
          {interpolatedStyles.map((config) => (
            <div
              key='doc-detail'
              style={{
                position: 'fixed',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 9999,
                opacity: config.style.o,
                height: '100%',
              }}
            >
              {doc && <DocDetail doc={doc} onClose={onClose} />}
            </div>
          ))}
        </div>
      )}
    </TransitionMotion>
  )
}

export default DocumentDetailModal
