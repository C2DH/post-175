import React from "react";
import ReactPlayer from "react-player";

export default class SideDocumentMedia extends React.PureComponent {
  render() {
    const { doc } = this.props;
    if (doc.type === "video") {
      return (
        <div className="doc-video">
          <ReactPlayer
            playing={true}
            loop={true}
            volume={0}
            width="100%"
            height="100%"
            url={doc.url}
          />
        </div>
      );
    } else {
      return (
        <div
          className="doc-image"
          style={{
            backgroundImage: `url(${
              doc.data.resolutions ? doc.data.resolutions.medium.url : ""
            })`
          }}
        />
      );
    }
  }
}
