import React, { PureComponent } from "react";
import { connect } from "react-redux";
import get from 'lodash/get'
import ReactMapGL, {
  NavigationControl,
  Marker,
  HTMLOverlay,
  Popup,
  FlyToInterpolator
} from "react-map-gl";
import Legend from "../components/Legend";
import TimeSeries from "../components/TimeSeries";
import {
  loadPlaces,
  unloadPlaces,
  unloadMap,
  setSelectedPlace,
  clearSelectedPlace,
  setOverPlace,
  clearOverPlace,
  loadStory,
  unloadStory,
  setDateTimelineMap,
  loadTimeSeries,
  unloadTimeSeries,
} from "../state/actions";
import {
  getPlacesInDate,
  getMapOverPlace,
  getMapSelectedPlace,
  getMapTimelineCurrentDate,
  getStory,
  getPlacesExtent,
  getTimeSeries,
  getTimeSeriesByIndicator,
} from "../state/selectors";
import { getQsSafeYear, makeUrlWithYear } from "../utils";
import TimelineNavigationMap from "../components/TimelineNavigationMap";
import MobileAlert from "../components/MobileAlert";
import MapTooltip from "../components/MapTooltip";
import SideMenu from '../components/SideMenu'
import { Motion, TransitionMotion, spring, presets } from "react-motion";

// TODO: Style that bitch
const CurrentYear = ({ year }) => <h1 className="map-year">{year}</h1>;

class MapPage extends PureComponent {
  state = {
    viewport: {
      longitude: 6.087,
      latitude: 49.667,
      zoom: 8
    },
    width: 0,
    height: 0
  };

  componentDidMount() {
    this.props.loadTimeSeries()
    this.props.loadStory("map");
    this.props.loadPlaces({ detailed: true });
    this.setMapSize();
    window.addEventListener("resize", this.setMapSize, false);
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.extent !== nextProps.extent &&
      nextProps.extent &&
      !nextProps.currentDateRaw
    ) {
      // Init current date from query string
      const year = getQsSafeYear(this.props.location);
      const { extent } = nextProps;
      if (
        year &&
        year >= extent[0].getFullYear() &&
        year <= extent[1].getFullYear()
      ) {
        this.props.setDateTimelineMap(new Date(`${year}`));
      } else {
        this.props.history.replace(
          makeUrlWithYear(
            this.props.location,
            nextProps.currentDate.getFullYear()
          )
        );
      }
    } else if (
      nextProps.currentDate &&
      this.props.currentDate &&
      this.props.currentDate.getFullYear() !==
        nextProps.currentDate.getFullYear() &&
      this.props.currentDateRaw
    ) {
      // Set new year in querystring when date change
      this.props.history.replace(
        makeUrlWithYear(
          this.props.location,
          nextProps.currentDate.getFullYear()
        )
      );
    }
  }

  componentWillUnmount() {
    this.props.unloadStory();
    this.props.unloadPlaces();
    this.props.unloadMap();
    this.props.unloadTimeSeries()
    window.removeEventListener("resize", this.setMapSize);
  }

  setMapSize = () => {
    this.setState({
      width: this.mapContainer.offsetWidth,
      height: this.mapContainer.offsetHeight,
    });
  };

  selectPlace = place => {
    this.props.setSelectedPlace(place);
    this.updateViewport({
      latitude: place.coordinates[1],
      longitude: place.coordinates[0],
      zoom: 13,
      transitionInterpolator: new FlyToInterpolator(),
      transitionDuration: 1000
    });
  };

  closePlaceDetail = () => {
    this.props.clearSelectedPlace();
    this.updateViewport({ zoom: 11 });
  };

  updateViewport = viewport => {
    this.setState({
      viewport: {
        ...this.state.viewport,
        ...viewport
      }
    });
  };

  render() {
    const { width, height, viewport } = this.state;
    const {
      places,
      overPlace,
      selectedPlace,
      setSelectedPlace,
      clearSelectedPlace,
      setOverPlace,
      clearOverPlace,
      currentDate,
      story,
      timeSeries,
      timeSeriesByIndicator
    } = this.props;

    return (
      <div className="h-100">
        <SideMenu />
        <div className='h-100 with-sidemenu bg-info d-flex flex-column'>
          <div style={{ height: 50 }} className='bg-info' />
          <div className='row no-gutters flex-1 bg-info'>
            <TimeSeries
              year={currentDate ? currentDate.getFullYear() : null}
              columns={get(timeSeries, 'columns', []).slice(1)}
              series={timeSeriesByIndicator}
            />
            {/* <Legend
              story={story}
              selectedPlace={selectedPlace}
              onClose={this.closePlaceDetail}
            /> */}
            <div
              className="d-flex flex-1 w-100 flex-column bg-darkgrey"
              style={{ overflow: "hidden" }}
              ref={node => (this.mapContainer = node)}
            >
              {width > 0 && (
                <ReactMapGL
                  {...viewport}
                  maxZoom={12}
                  minZoom={7.5}
                  mapboxApiAccessToken="pk.eyJ1IjoiZ2lvcmdpb3Vib2xkaSIsImEiOiJjamI4NWd1ZWUwMDFqMndvMzk1ODU3NWE2In0.3bX3jRxCi0IaHbmQTkQfDg"
                  mapStyle="mapbox://styles/giorgiouboldi/cjalcurkr00os2soczuclhjxl"
                  height={height}
                  width={width}
                  onViewportChange={this.updateViewport}
                >
                  <div style={{ position: "absolute", right: 5, top: 5 }}>
                    <NavigationControl onViewportChange={this.updateViewport} />
                  </div>
                  {currentDate && (
                    <CurrentYear year={currentDate.getFullYear()} />
                  )}
                  {false && places &&
                    places.map(place => {
                      const isSelected = selectedPlace
                        ? place.id === selectedPlace.id
                        : false;
                      return (
                        <Marker
                          key={place.id}
                          longitude={place.coordinates[0]}
                          latitude={place.coordinates[1]}
                        >
                          <div onClick={() => this.selectPlace(place)}>
                            {!isSelected && (
                              <svg width={12} height={12}>
                                <circle
                                  onMouseEnter={() => setOverPlace(place)}
                                  onMouseLeave={() => clearOverPlace()}
                                  stroke="black"
                                  cx={6}
                                  cy={6}
                                  r={5}
                                  fill={place.open ? "#13d436" : "#fdd00c"}
                                />
                              </svg>
                            )}
                            {isSelected && (
                              <svg width={40} height={40}>
                                <circle
                                  stroke="black"
                                  cx={20}
                                  cy={20}
                                  r={10}
                                  fill={place.open ? "#13d436" : "#fdd00c"}
                                />
                                <circle
                                  cx={20}
                                  cy={20}
                                  r={20}
                                  fill="transparent"
                                  stroke={place.open ? "#13d436" : "#fdd00c"}
                                />
                              </svg>
                            )}
                          </div>
                        </Marker>
                      );
                    })}

                  <TransitionMotion
                    defaultStyles={
                      overPlace
                        ? [
                            {
                              key: "popup",
                              data: { overPlace },
                              style: { o: 0 }
                            }
                          ]
                        : []
                    }
                    styles={
                      overPlace
                        ? [
                            {
                              key: "popup",
                              data: { overPlace },
                              style: { o: spring(1) }
                            }
                          ]
                        : []
                    }
                    willLeave={() => ({ o: spring(0) })}
                    willEnter={() => ({ o: 0 })}
                  >
                    {interpolatedStyles => (
                      <div>
                        {interpolatedStyles.map(config => {
                          return (
                            <div key={config.key}>
                              <Popup
                                latitude={config.data.overPlace.coordinates[1]}
                                longitude={config.data.overPlace.coordinates[0]}
                                tipSize={0}
                                closeOnClick={false}
                                anchor="bottom"
                                closeButton={false}
                                offsetBottom={15}
                              >
                                <MapTooltip
                                  style={{ opacity: config.style.o }}
                                  place={config.data.overPlace}
                                />
                              </Popup>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </TransitionMotion>
                </ReactMapGL>
              )}
            </div>
          </div>
          {places && <TimelineNavigationMap />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  story: getStory(state),
  places: getPlacesInDate(state),
  overPlace: getMapOverPlace(state),
  selectedPlace: getMapSelectedPlace(state),
  currentDate: getMapTimelineCurrentDate(state),
  currentDateRaw: state.map.currentDate,
  extent: getPlacesExtent(state),
  timeSeries: getTimeSeries(state),
  timeSeriesByIndicator: getTimeSeriesByIndicator(state),
});
export default connect(
  mapStateToProps,
  {
    loadTimeSeries,
    unloadTimeSeries,
    loadPlaces,
    unloadPlaces,
    unloadMap,
    setSelectedPlace,
    clearSelectedPlace,
    setOverPlace,
    clearOverPlace,
    loadStory,
    unloadStory,
    setDateTimelineMap
  }
)(MapPage);
