import React, { Component } from 'react'
import ReactPlayer from 'react-player'
import TopControls from './TopControls'
import Speaker from './Speaker'
import LangSwitcher from './LangSwitcher'
import Subtitles from './Subtitles'
import './VideoStory.css'

export default class VideoStory extends Component {
  state = {
    durationSeconds: 0,
    loaded: 0,
    loadedSeconds: 0,
    playedSeconds: 0,
    played: 0,
  }

  onProgress = (progressState) => {
    this.setState(progressState)
  }

  onDuration = (durationSeconds) => {
    this.setState({ durationSeconds })
  }

  render() {
    const { url, title, getSpeakerAt } = this.props
    const { durationSeconds, playedSeconds, played } = this.state
    // const doc = getDocAtVideoTime('00:23')
    const speaker = getSpeakerAt(playedSeconds)

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
          <div className='video-container'>
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
          {/* <SideDocument /> */}
          <div className='h-100 bg-info' style={{ width: 400 }}/>
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
