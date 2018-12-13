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
    playing: true,
    subtitles: [],
  }

  componentDidMount() {
    const video = this.player.getInternalPlayer()
    // TODO: Maybe check what happends when languages change...
    // i think the track dom element change
    const track = video.textTracks[0]
    if (track) {
      track.addEventListener('cuechange', this.setSubtitles)
    }
  }

  componentWillUnmount() {
    const video = this.player.getInternalPlayer()
    const track = video.textTracks[0]
    if (track) {
      track.removeEventListener('cuechange', this.setSubtitles)
    }
  }

  setSubtitles = (e) => {
    const subtitles = Array.from(e.target.activeCues).map(cue => cue.text)
    this.setState({ subtitles })
  }

  onProgress = (progressState) => {
    this.setState(progressState)
  }

  onDuration = (durationSeconds) => {
    this.setState({ durationSeconds })
  }

  onSeek = (percent) => {
    this.player.seekTo(percent)
    // this.setState({played: percent})
  }

  handleSideDocDrag = (e, data) => {
    return this.setState(prevState => ({
      sideWidth: Math.max(prevState.sideWidth + (-data.x), MIN_SIDE_WIDTH),
    }))
  }

  togglePlaying = () => this.setState({playing: !this.state.playing})

  render() {
    const { url, title, getSpeakerAt, getSideDocAt, sideDocs, story, subtitlesFile } = this.props
    const { durationSeconds, playedSeconds, played, sideWidth, playing, subtitles } = this.state
    const speaker = getSpeakerAt(playedSeconds)
    const sideDoc = getSideDocAt(playedSeconds)
    const tracks = []
    if (subtitlesFile) {
      tracks.push({
        kind: 'subtitles',
        src: subtitlesFile,
        default: true
      })
    }

    return (
      <div className='video-story'>

        <div className='video-story-top'>
          <TopControls
            durationSeconds={durationSeconds}
            playedSeconds={playedSeconds}
            played={played}
            sideDocs={sideDocs}
            story={story}
            playing={playing}
            togglePlaying={this.togglePlaying}
            onSeek={this.onSeek}
          />
        </div>

        <div className='video-story-video'>
          <div className='video-container'>
            <ReactPlayer
              ref={r => this.player = r}
              controls
              onDuration={this.onDuration}
              onProgress={this.onProgress}
              playing={playing}
              volume={0}
              width='100%'
              height='100%'
              progressInterval={500}
              url={url}
              config={{
                file: { tracks }
              }}
            />
          </div>
          <SideDocument
            doc={sideDoc}
            onDrag={this.handleSideDocDrag}
            width={sideWidth}
          />
        </div>

        <div className='video-story-bottom'>
          <LangSwitcher />
          <Speaker doc={speaker} />
          <Subtitles subtitles={subtitles} />
        </div>

      </div>
    )
  }
}
