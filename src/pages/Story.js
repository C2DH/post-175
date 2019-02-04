import React, { Component } from "react";
import { connect } from "react-redux";
import find from "lodash/find";
import VideoStory from "../components/VideoStory";
import { loadStory, unloadStory } from "../state/actions";
import {
  getVideoStory,
  getVideoUrl,
  getSpeakers,
  getSideDocs,
  getVideoSubtitlesFile,
  getVideoStoryTitle
} from "../state/selectors";

const betweenTime = playedSeconds => ({ secondsFrom, secondsTo }) => {
  const intSeconds = parseInt(playedSeconds, 10);
  return intSeconds >= secondsFrom && intSeconds <= secondsTo;
};

class Story extends Component {
  componentDidMount() {
    this.props.loadStory(this.props.match.params.id);
  }

  componentDidUpdate(prevPros) {
    if (this.props.match.params.id !== prevPros.match.params.id) {
      this.props.unloadStory();
      this.props.loadStory(this.props.match.params.id);
    }
  }

  componentWillUnmount() {
    this.props.unloadStory();
  }

  speakerAt = playedSeconds => {
    const { speakers } = this.props;
    const speaker = find(speakers, betweenTime(playedSeconds));
    if (speaker) {
      return speaker.doc;
    }
    return null;
  };

  sideDocAt = playedSeconds => {
    const { sideDocs } = this.props;
    const sideDoc = find(sideDocs, betweenTime(playedSeconds));
    if (sideDoc) {
      return sideDoc.doc;
    }
    return null;
  };

  goBack = () => this.props.history.push("/stories");

  render() {
    const { story, url, title, sideDocs, subtitlesFile } = this.props;
    return (
      <div className="h-100">
        {story && (
          <VideoStory
            url={url}
            subtitlesFile={subtitlesFile}
            getSideDocAt={this.sideDocAt}
            getSpeakerAt={this.speakerAt}
            sideDocs={sideDocs}
            title={title}
            onBack={this.goBack}
          />
        )}
      </div>
    );
  }
}

export default connect(
  state => ({
    title: getVideoStoryTitle(state),
    story: getVideoStory(state),
    url: getVideoUrl(state),
    subtitlesFile: getVideoSubtitlesFile(state),
    sideDocs: getSideDocs(state),
    speakers: getSpeakers(state)
  }),
  {
    loadStory,
    unloadStory
  }
)(Story);
