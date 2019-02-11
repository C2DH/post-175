import React, { Component } from "react";
import ReactPlayer from "react-player";
import HomeMenu from "../HomeMenu";
import TopControls from "./TopControls";
import Speaker from "./Speaker";
import Subtitles from "./Subtitles";
import SideDocument from "./SideDocument";
import { localize } from "../../localize";
import "./VideoStory.scss";

const MIN_SIDE_WIDTH = 30;

class VideoStory extends Component {
  state = {
    durationSeconds: 0,
    loaded: 0,
    loadedSeconds: 0,
    playedSeconds: 0,
    played: 0,
    volume: 0,
    sideWidth: 300,
    playing: true,
    subtitles: []
  };

  onPlayerReady = () => {
    // Nothing to do
    if (this.videoInit) {
      return
    }
    const video = this.player.getInternalPlayer();
    if (video) {
      const track = video.textTracks[0];
      // This means that the autoplay don't start the video
      // so set the state local state abut playing to false
      if (video.paused && this.state.playing) {
        this.setState({ playing: false })
      }
      if (track) {
        // This is necessary because onPlayerReady can be called multiple times...
        this.videoInit = true
        track.addEventListener("cuechange", this.setSubtitles);
      }
    }
  };

  componentWillUnmount() {
    const video = this.player.getInternalPlayer();
    if (video) {
      const track = video.textTracks[0];
      if (track) {
        track.removeEventListener("cuechange", this.setSubtitles);
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.subtitlesFile !== prevProps.subtitlesFile &&
      this.props.subtitlesFile
    ) {
      // XXX HACK XXX
      // Super workaround
      // On firefox when the track src change the subtitles won't change
      // so when the subtitles file change set videoInit to false
      // so when player is ready the event listener is re-setted
      // and seek to the current seconds because when the player is
      // destroied the state abount video played is lost
      if (navigator.userAgent.toLowerCase().indexOf("firefox") !== -1) {
        this.videoInit = false
        this.player.seekTo(parseInt(this.state.playedSeconds))
        this.setState({ subtitles: [] })
      }
    }
  }

  setSubtitles = e => {
    const subtitles = Array.from(e.target.activeCues).map(cue => cue.text);
    this.setState({ subtitles });
  };

  onProgress = progressState => {
    console.log('Progess!', progressState)
    this.setState(progressState);
  };

  onDuration = durationSeconds => {
    this.setState({ durationSeconds });
  };

  onSeek = percent => {
    this.player.seekTo(percent);
    // this.setState({played: percent})
  };

  handleSideDocDrag = (e, data) => {
    return this.setState(prevState => ({
      sideWidth: Math.max(prevState.sideWidth + -data.x, MIN_SIDE_WIDTH)
    }));
  };

  setVolume = volume => this.setState({ volume });

  togglePlaying = () => this.setState({ playing: !this.state.playing });

  stopPlaying = () => this.setState({ playing: false });

  setMinSideWidth = () => this.setState({ sideWidth: 300 });

  render() {
    const {
      url,
      getSpeakerAt,
      getSideDocAt,
      sideDocs,
      title,
      subtitlesFile,
      onBack,
      t
    } = this.props;
    const {
      durationSeconds,
      playedSeconds,
      played,
      sideWidth,
      playing,
      subtitles,
      volume
    } = this.state;
    const speaker = getSpeakerAt(playedSeconds);
    const sideDoc = getSideDocAt(playedSeconds);

    const tracks = [];
    if (subtitlesFile) {
      tracks.push({
        kind: "metadata",
        src: subtitlesFile,
        default: true
      });
    }
    // XXX HACK XXX
    // Super workaround
    // On firefox when the track src change the subtitles won't change
    // so setting key to ReactPlayer cause mount/unmount of node
    const playerKey =
      navigator.userAgent.toLowerCase().indexOf("firefox") !== -1
        ? subtitlesFile
        : undefined;

    return (
      <div className="video-story">
        <div className="video-story-top">
          <TopControls
            onBack={onBack}
            durationSeconds={durationSeconds}
            playedSeconds={playedSeconds}
            played={played}
            sideDocs={sideDocs}
            title={title}
            playing={playing}
            togglePlaying={this.togglePlaying}
            onSeek={this.onSeek}
            volume={volume}
            setVolume={this.setVolume}
          />
        </div>

        <div className="video-story-video">
          <div className="video-container">
            <ReactPlayer
              key={playerKey}
              ref={r => (this.player = r)}
              onClick={this.togglePlaying}
              onReady={this.onPlayerReady}
              onDuration={this.onDuration}
              onProgress={this.onProgress}
              playing={playing}
              volume={volume}
              width="100%"
              height="100%"
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
            stopPlaying={this.stopPlaying}
            t={t}
          />
        </div>

        <div className="video-story-bottom py-4">
          <HomeMenu />
          <div className="container text-white">
            <div className="row">
              <div className="col-4">
                <Speaker doc={speaker} t={t} />
              </div>
              <div className="col-8">
                <Subtitles subtitles={subtitles} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default localize()(VideoStory);
