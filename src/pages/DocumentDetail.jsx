import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { getDocDetail } from '../state/selectors'
import { loadDocument, unloadDocument } from '../state/actions'
import DocDetail from '../components/DocDetail'
import Spinner from '../components/Spinner'

const DocumentDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const doc = useSelector(getDocDetail)

  useEffect(() => {
    if (id) dispatch(loadDocument(id))
    return () => dispatch(unloadDocument())
  }, [dispatch, id])

  const onClose = () => {
    navigate('/collection')
  }

  return (
    <div className='h-100'>
      {!doc && <Spinner screen='docDetail' firstLoading />}
      {doc && <DocDetail doc={doc} onClose={onClose} />}
    </div>
  )
}

export default DocumentDetail
