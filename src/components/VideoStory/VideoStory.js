import React, { Component } from 'react'
import ReactPlayer from 'react-player'
import TopControls from './TopControls'
import Speaker from './Speaker'
import LangSwitcher from './LangSwitcher'
import Subtitles from './Subtitles'
import SideDocument from './SideDocument'
import './VideoStory.css'

const MIN_SIDE_WIDTH = 250

export default class VideoStory extends Component {
  state = {
    durationSeconds: 0,
    loaded: 0,
    loadedSeconds: 0,
    playedSeconds: 0,
    played: 0,
    sideWidth: 400,
  }

  onProgress = (progressState) => {
    this.setState(progressState)
  }

  onDuration = (durationSeconds) => {
    this.setState({ durationSeconds })
  }

  handleSideDocDrag = (e, data) => {
    return this.setState(prevState => ({
      sideWidth: Math.max(prevState.sideWidth + (-data.x), MIN_SIDE_WIDTH),
    }))
  }

  render() {
    const { url, title, getSpeakerAt, getSideDocAt } = this.props
    const { durationSeconds, playedSeconds, played, sideWidth } = this.state
    const speaker = getSpeakerAt(playedSeconds)
    const sideDoc = getSideDocAt(playedSeconds)

    return (
      <div className='video-story'>

        <div className='video-story-top'>
          <TopControls
            durationSeconds={durationSeconds}
            playedSeconds={playedSeconds}
            played={played}
          />
        </div>

        <div className='video-story-video'>
          <div className='video-container bg-danger'>
            <ReactPlayer
              controls
              onDuration={this.onDuration}
              onProgress={this.onProgress}
              playing
              volume={0}
              width='100%'
              height='100%'
              url={url}
            />
          </div>
          <SideDocument
            onDrag={this.handleSideDocDrag}
            width={sideWidth}
          />
        </div>

        <div className='video-story-bottom'>
          <LangSwitcher />
          <Speaker doc={speaker} />
          <Subtitles />
        </div>

      </div>
    )
  }
}
