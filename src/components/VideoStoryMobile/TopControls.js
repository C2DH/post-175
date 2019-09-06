import React, { memo } from "react";
import { UncontrolledTooltip } from "reactstrap";
import moment from "moment";

export default memo(function TopControls({
  durationSeconds,
  playedSeconds,
  played,
  sideDocs,
  title,
  playing,
  togglePlaying,
  onSeek,
  volume,
  setVolume,
  onBack
}) {
  const playedMinutes = moment
    .utc(parseInt(playedSeconds) * 1000)
    .format("mm:ss");
  const durationMinutes = moment
    .utc(parseInt(durationSeconds) * 1000)
    .format("mm:ss");
  return (
    <React.Fragment>
      <div className="video-story-top">
        <button
          type="button"
          className="control-button btn btn-light rounded-0 close-icon"
          onClick={onBack}
        >
          <i className="material-icons">subdirectory_arrow_right</i>
        </button>
        <button
          className="control-button btn btn-light rounded-0"
          onClick={togglePlaying}
        >
          {playing ? (
            <i className="material-icons">pause</i>
          ) : (
            <i className="material-icons">play_arrow</i>
          )}
        </button>
        <button
          className="control-button btn btn-light rounded-0"
          onClick={() => setVolume(volume === 0 ? 1 : 0)}
        >
          {volume === 0 ? (
            <i className="material-icons">volume_off</i>
          ) : (
            <i className="material-icons">volume_up</i>
          )}
        </button>
        <div className="col d-flex align-items-center justify-content-center text-white">
          ({playedMinutes}/{durationMinutes})
        </div>
      </div>
      <div className="video-story-track">
        <div className="track-container">
          <div
            className="track"
            onClick={e => {
              const rect = e.target.getBoundingClientRect();
              const clickX = e.clientX - rect.x;
              const percentOffset = clickX / rect.width;
              onSeek(percentOffset);
            }}
          >
            <div className="progress" style={{ width: `${played * 100}%` }} />
            {sideDocs &&
              sideDocs.length > 0 &&
              sideDocs.map((sideDoc, i) => (
                <React.Fragment key={i}>
                  <div
                    className="side-doc-line"
                    style={{
                      left: `${(sideDoc.secondsFrom / durationSeconds) * 100}%`
                    }}
                  />
                  <div
                    onClick={e => {
                      e.stopPropagation();
                      onSeek(sideDoc.secondsFrom / durationSeconds);
                    }}
                    id={`side-doc-${i}`}
                    className="side-doc"
                    style={{
                      left: `${(sideDoc.secondsFrom / durationSeconds) * 100}%`
                    }}
                  />
                </React.Fragment>
              ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
});
