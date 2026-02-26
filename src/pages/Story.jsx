import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import find from 'lodash/find'
import VideoStory from '../components/VideoStory'
import VideoStoryMobile from '../components/VideoStoryMobile'
import Spinner from '../components/Spinner'
import Media from 'react-media'
import { loadStory, unloadStory } from '../state/actions'
import {
  getVideoStory,
  getVideoUrl,
  getSpeakers,
  getSideDocs,
  getVideoSubtitlesFile,
  getVideoStoryTitle,
} from '../state/selectors'

const betweenTime =
  (playedSeconds) =>
  ({ secondsFrom, secondsTo }) => {
    const intSeconds = parseInt(playedSeconds, 10)
    return intSeconds >= secondsFrom && intSeconds <= secondsTo
  }

const Story = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const title = useSelector(getVideoStoryTitle)
  const story = useSelector(getVideoStory)
  const url = useSelector(getVideoUrl)
  const subtitlesFile = useSelector(getVideoSubtitlesFile)
  const sideDocs = useSelector(getSideDocs)
  const speakers = useSelector(getSpeakers)

  useEffect(() => {
    if (id) dispatch(loadStory(id))
    return () => dispatch(unloadStory())
  }, [dispatch, id])

  const speakerAt = (playedSeconds) => {
    const speaker = find(speakers, betweenTime(playedSeconds))
    if (speaker) {
      return speaker.doc
    }
    return null
  }

  const sideDocAt = (playedSeconds) => {
    const sideDoc = find(sideDocs, betweenTime(playedSeconds))
    if (sideDoc) {
      return sideDoc.doc
    }
    return null
  }

  const goBack = () => navigate('/stories')

  return (
    <div className='h-100'>
      {story === null && <Spinner screen='storyDetail' firstLoading />}
      {story && (
        <Media query='(max-width: 767.98px)'>
          {(matches) =>
            matches ? (
              <VideoStoryMobile
                url={url}
                subtitlesFile={subtitlesFile}
                getSideDocAt={sideDocAt}
                getSpeakerAt={speakerAt}
                sideDocs={sideDocs}
                title={title}
                onBack={goBack}
              />
            ) : (
              <VideoStory
                url={url}
                subtitlesFile={subtitlesFile}
                getSideDocAt={sideDocAt}
                getSpeakerAt={speakerAt}
                sideDocs={sideDocs}
                title={title}
                onBack={goBack}
              />
            )
          }
        </Media>
      )}
    </div>
  )
}

export default Story
