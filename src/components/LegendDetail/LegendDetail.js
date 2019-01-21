import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import { get, head } from "lodash";
import { localize } from "../../localize";
import { TransitionMotion, spring } from "react-motion";
import { StaticMap } from "react-map-gl";
import PlaceOpeningTimeline from "../PlaceOpeningTimeline";
import "./LegendDetail.scss";

const CloseLegendDetailBtn = ({ onclick }) => (
  <div
    className="position-absolute legend-close-btn"
    style={{ zIndex: 999, right: 0 }}
  >
    <button
      className="btn btn-light legend-close rounded-0 d-flex justify-content-center"
      onClick={onclick}
    >
      <i className="material-icons">close</i>
    </button>
  </div>
);

class StaticPlaceMap extends PureComponent {
  state = {
    width: 0,
    height: 0
  };

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);
    const width = node.offsetWidth;
    const height = node.offsetHeight;
    this.setState({ width, height });
  }

  render() {
    const { place } = this.props;
    const { width, height } = this.state;
    return (
      <div className="w-100 p-0 cover legend-detail-image">
        <div style={{ position: "absolute", height: "100%", width: "100%" }}>
          <StaticMap
            mapboxApiAccessToken="pk.eyJ1IjoiZ2lvcmdpb3Vib2xkaSIsImEiOiJjamI4NWd1ZWUwMDFqMndvMzk1ODU3NWE2In0.3bX3jRxCi0IaHbmQTkQfDg"
            mapStyle="mapbox://styles/mapbox/satellite-v8"
            height={height}
            width={width}
            latitude={place.coordinates[1]}
            longitude={place.coordinates[0]}
            zoom={18}
          />
        </div>
      </div>
    );
  }
}

const CoversButtons = ({ clickNext, clickBack }) => (
  <div
    className="d-flex flex-row align-self-end bg-white"
    style={{ height: 36 }}
  >
    <button
      className="btn btn-light flex-1 rounded-0 d-flex justify-content-center"
      onClick={clickNext}
    >
      <i className="material-icons font-14">arrow_back</i>
    </button>
    <button
      className="btn btn-light flex-1 rounded-0 d-flex justify-content-center"
      onClick={clickBack}
    >
      <i className="material-icons font-14">arrow_forward</i>
    </button>
  </div>
);

class LegendDetail extends PureComponent {
  state = {
    selectedDocument: null,
    onImage: false
  };

  getSelectedDocument = () => {
    return this.state.selectedDocument
      ? this.state.selectedDocument
      : head(this.props.place.documents);
  };

  nextDoc = () => {
    const { place } = this.props;
    const index = place.documents.indexOf(this.getSelectedDocument());
    const selectedDocument =
      index + 1 === place.documents.length
        ? place.documents[0]
        : place.documents[index + 1];
    this.setState({ selectedDocument });
  };

  prevDoc = () => {
    const { place } = this.props;
    const index = place.documents.indexOf(this.getSelectedDocument());
    const selectedDocument =
      index === 0
        ? place.documents[place.documents.length - 1]
        : place.documents[index - 1];
    this.setState({ selectedDocument });
  };

  render() {
    const { place, style, t, onClose } = this.props;
    const { onImage } = this.state;
    const selectedDocument = this.getSelectedDocument();
    const image = get(selectedDocument, "data.resolutions.medium.url");

    return (
      <div
        className="d-flex flex-column h-100 overflow-auto w-100 LegendDetail"
        style={{
          ...style,
          zIndex: 2,
          position: "absolute",
          top: 0,
          backgroundColor: "white"
        }}
      >
        {place && <CloseLegendDetailBtn onclick={onClose} />}
        <div
          onMouseEnter={() => this.setState({ onImage: true })}
          onMouseLeave={() => this.setState({ onImage: false })}
          style={{ backgroundImage: `url(${image})` }}
          className="cover legend-detail-image"
        >
          <TransitionMotion
            defaultStyles={
              onImage ? [{ key: "overlay", style: { y: 100 } }] : []
            }
            styles={
              onImage ? [{ key: "overlay", style: { y: spring(0) } }] : []
            }
            willLeave={() => ({ y: spring(100) })}
            willEnter={() => ({ y: 100 })}
          >
            {styles => (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  left: 0,
                  overflow: "hidden"
                }}
              >
                {styles.map(({ style, key }) => (
                  <div
                    key={key}
                    style={{ transform: `translateY(${style.y}px)` }}
                    className="w-100 bg-overlay text-white d-flex flex-row justify-content-between"
                  >
                    <div className="font-12 m-3">
                      {get(selectedDocument, "data.title")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TransitionMotion>

          {place.documents.length > 1 && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                right: 0,
                overflow: "hidden",
                zIndex: 99
              }}
            >
              <CoversButtons
                clickBack={this.nextDoc}
                clickNext={this.prevDoc}
              />
            </div>
          )}
        </div>
        <div className="p-3">
          <p className="mb-0 text-black-50 place-type">
            {t(place.data.place_type)}
          </p>
          <h4>{place.data.title}</h4>
          <p className="text-black-50 place-type">
            <i className="material-icons font-12">place</i> {place.data.address}
          </p>
        </div>
        <div className="border-top border-bottom pb-3 px-3">
          <PlaceOpeningTimeline
            openDate={place.startDate}
            closeDate={place.endDate}
          />
        </div>

        <div className="p-3">
          <p>{place.data.description}</p>
        </div>
        <StaticPlaceMap place={place} />
      </div>
    );
  }
}

export default localize()(LegendDetail);
