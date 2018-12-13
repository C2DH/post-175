import React, { Component } from 'react'
import { connect } from 'react-redux'
import find from 'lodash/find'
import VideoStory from '../components/VideoStory'
import { loadStory } from '../state/actions'
import {
  getVideoStory,
  getVideoUrl,
  getSpeakers,
  getSideDocs,
} from '../state/selectors'

const betweenTime = playedSeconds => ({ secondsFrom, secondsTo }) => {
  return playedSeconds >= secondsFrom && playedSeconds <= secondsTo
}

class DemoStory extends Component {
  componentDidMount() {
    this.props.loadStory('video_fake_story')
  }

  speakerAt = playedSeconds => {
    const { speakers } = this.props
    const speaker = find(speakers, betweenTime(playedSeconds))
    if (speaker) {
      return speaker.doc
    }
    return null
  }

  sideDocAt = playedSeconds => {
    const { sideDocs } = this.props
    const sideDoc = find(sideDocs, betweenTime(playedSeconds))
    if (sideDoc) {
      return sideDoc.doc
    }
    return null
  }

  render() {
    const { story, url, speakers, sideDocs } = this.props
    console.log(story, speakers, sideDocs)
    return (
      <div className='h-100 bg-dark'>
        {story && (
          <VideoStory
            url={url}
            getSideDocAt={this.sideDocAt}
            getSpeakerAt={this.speakerAt}
            sideDocs={sideDocs}
            story={story}
          />
        )}
      </div>
    )
  }
}

export default connect(state => ({
  story: getVideoStory(state),
  url: getVideoUrl(state),
  sideDocs: getSideDocs(state),
  speakers: getSpeakers(state),
}), {
  loadStory,
})(DemoStory)
