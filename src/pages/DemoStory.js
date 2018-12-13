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

const stringTimeToSeconds = str => {
  const [min, secs] = str.split(':')
  return (parseInt(min) * 60) + parseInt(secs)
}

class DemoStory extends Component {
  componentDidMount() {
    this.props.loadStory('video_fake_story')
  }

  speakerAt = playedSeconds => {
    const { speakers } = this.props
    const speaker = find(speakers, speaker => {
      const secondsFrom = stringTimeToSeconds(speaker.from)
      const secondsTo = stringTimeToSeconds(speaker.to)
      return playedSeconds >= secondsFrom && playedSeconds <= secondsTo
    })
    if (speaker) {
      return speaker.doc
    }
    return null
  }

  render() {
    const { story, url, speakers } = this.props
    console.log(story, speakers)
    return (
      <div className='h-100 bg-dark'>
        {story && (
          <VideoStory
            url={url}
            getSpeakerAt={this.speakerAt}
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
