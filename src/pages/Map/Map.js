import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { localize } from "../../localize";
import get from "lodash/get";
import mapboxgl from "mapbox-gl";
import Immutable from "immutable";
import memoize from "memoize-one";
import qs from "query-string";
// import ReactMapGL, {
//   NavigationControl,
//   Marker,
//   HTMLOverlay,
//   Popup,
//   FlyToInterpolator
// } from "react-map-gl";
import MapGL, {
  Marker,
  Popup,
  Layer,
  Cluster,
  Source
} from "@urbica/react-map-gl";

import Legend from "../../components/Legend";
import TimeSeries from "../../components/TimeSeries";
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
  loadRasterLayers,
  unloadRasterLayers
} from "../../state/actions";
import {
  getPlacesInDate,
  getMapOverPlace,
  getMapSelectedPlace,
  getMapTimelineCurrentDate,
  getStory,
  getPlacesExtent,
  getTimeSeries,
  getTimeSeriesByIndicator,
  getRasterLayers,
  getPlaceTypesCount
} from "../../state/selectors";
import { getQsSafeYear, makeUrlWithYear } from "../../utils";
import TimelineNavigationMap from "../../components/TimelineNavigationMap";
import MobileAlert from "../../components/MobileAlert";
import MapTooltip from "../../components/MapTooltip";
import SideMenu from "../../components/SideMenu";
import { scaleLinear } from "d3-scale";
import { Motion, TransitionMotion, spring, presets } from "react-motion";
import { Text } from "@vx/text";
import classNames from "classnames";
import { MAP_ICON } from "../../consts";
import "./Map.scss";

const circleScale = scaleLinear()
  .range([30, 100])
  .domain([1, 184]);

// TODO: Style that bitch
const CurrentYear = ({ year }) => <h1 className="map-year">{year}</h1>;

const ClusterElement = cluster => {
  const r = circleScale(cluster.properties.point_count_abbreviated);
  return (
    <svg width={r + 2} height={r + 2}>
      <circle
        cx={r / 2}
        cy={r / 2}
        r={Math.floor(r / 2)}
        fill={"rgba(216,216,216,0.13)"}
        stroke="#979797"
      />
      <Text
        x={r / 2}
        y={r / 2}
        fill="white"
        textAnchor="middle"
        verticalAnchor="middle"
      >
        {cluster.properties.point_count_abbreviated}
      </Text>
    </svg>
  );
};

const MapHeader = ({
  placeTypesCount,
  t,
  opacity,
  onOpacityChange,
  showOpacity,
  selectedPlaceTypes,
  toggleSelectedPlace
}) => {
  const counts = ["office", "central", "telegraph"].map(type => ({
    label: type,
    count: placeTypesCount[type] || 0
  }));
  // .filter(({ count }) => count);
  return (
    <div className="top-bar d-flex justify-content-between">
      <div className="text-white d-flex align-items-center">
        {counts.map(({ label, count }) => (
          <div
            key={label}
            onClick={() => toggleSelectedPlace(label)}
            className={classNames(
              "map-filters mr-4 d-flex align-items-center",
              {
                active:
                  selectedPlaceTypes.indexOf(label) !== -1 ||
                  !selectedPlaceTypes.length
              }
            )}
          >
            <i className="material-icons">{MAP_ICON[label]}</i>
            <span className="ml-2">
              {label} {`(${count})`}
            </span>
          </div>
        ))}
      </div>
      {showOpacity && (
        <div className="map-opacity d-flex align-items-center text-white">
          <span className="mr-3">Historical map opacity</span>
          <input
            onChange={onOpacityChange}
            value={opacity}
            type="range"
            min={0}
            max={1}
            step={0.1}
          />
        </div>
      )}
    </div>
  );
};

class Map extends PureComponent {
  state = {
    viewport: {
      longitude: 6.087,
      latitude: 49.667,
      zoom: 8
    },
    supercluster: null,
    width: 0,
    height: 0,
    opacity: 0.5
  };

  componentDidMount() {
    this.props.loadTimeSeries();
    this.props.loadStory("map");
    this.props.loadPlaces({ detailed: true });
    this.props.loadRasterLayers({});
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

  componentDidUpdate(oldProps) {
    // if(oldProps.rasterLayers !== this.props.rasterLayers){
    // console.log("rasterLayers",this.props.rasterLayers)
    // }
    if (this.mapRef && !this.hasNavigation) {
      const map = this.mapRef.getMap();
      // console.log("maaap", map)
      map.addControl(new mapboxgl.NavigationControl());
      this.hasNavigation = true;
    }
  }

  componentWillUnmount() {
    this.props.unloadStory();
    this.props.unloadPlaces();
    this.props.unloadMap();
    this.props.unloadTimeSeries();
    this.props.unloadRasterLayers();
    window.removeEventListener("resize", this.setMapSize);
  }

  handleOnOpacityChange = e => this.setState({ opacity: e.target.value });

  setMapSize = () => {
    this.setState({
      width: this.mapContainer.offsetWidth,
      height: this.mapContainer.offsetHeight
    });
  };

  selectPlace = place => {
    if (place.data.place_type === "office") {
      this.props.setSelectedPlace(place);
      this.updateViewport({
        latitude: place.coordinates[1],
        longitude: place.coordinates[0],
        zoom: 14,
        // transitionInterpolator: new FlyToInterpolator(),
        transitionDuration: 1000
      });
    }
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

  getLayers = memoize((rasterLayers, year, opacity) => {
    if (!rasterLayers) {
      return [];
    }

    return rasterLayers
      .filter(layer => new Date(layer.data.start_date).getFullYear() === year)
      .map(l =>
        Immutable.fromJS({
          id: l.id.toString(),
          type: "raster",
          source: l.id.toString(),
          paint: { "raster-opacity": +opacity },
          layout: { visibility: "visible" },
          minzoom: 0,
          maxzoom: 22
        })
      );
  });

  getSources = memoize(rasterLayers => {
    if (!rasterLayers) {
      return [];
    }
    return rasterLayers.map(l =>
      Immutable.fromJS({
        id: l.id.toString(),
        type: "raster",
        tiles: [
          `https://api.mapbox.com/v4/${
            l.data.raster_layer
          }/{z}/{x}/{y}@2x.png?access_token=pk.eyJ1IjoiZ2lvcmdpb3Vib2xkaSIsImEiOiJjamI4NWd1ZWUwMDFqMndvMzk1ODU3NWE2In0.3bX3jRxCi0IaHbmQTkQfDg`
        ]
      })
    );
  });

  getSelectedPlaces = () => {
    return get(qs.parse(this.props.location.search), "places", "")
      .split(",")
      .filter(Boolean);
  };

  toggleSelectedPlace = place => {
    const { location } = this.props;
    const places = this.getSelectedPlaces();
    let newPlaces;
    if (places.indexOf(place) === -1) {
      newPlaces = places.concat(place);
    } else {
      newPlaces = places.filter(p => p !== place);
    }

    const qsAsObject = qs.parse(location.search);
    const newQs = qs.stringify(
      {
        ...qsAsObject,
        places: newPlaces.join(",")
      },
      {
        encode: false
      }
    );
    this.props.history.replace(`${location.pathname}?${newQs}`);
  };

  getFilteredPlaces = memoize((places, placeTypes) => {
    if (placeTypes.length === 0) {
      return places;
    }
    return places.filter(place => {
      return placeTypes.indexOf(place.data.place_type) !== -1;
    });
  });

  render() {
    const { width, height, viewport } = this.state;
    const {
      placesInTime,
      overPlace,
      selectedPlace,
      setSelectedPlace,
      clearSelectedPlace,
      setOverPlace,
      clearOverPlace,
      currentDate,
      story,
      timeSeries,
      timeSeriesByIndicator,
      extent,
      rasterLayers,
      placeTypesCount,
      t
    } = this.props;

    const mapboxSources = this.getSources(rasterLayers);
    const mapboxRasters = this.getLayers(
      rasterLayers,
      currentDate ? currentDate.getFullYear() : null,
      this.state.opacity
    );
    const selectedPlaceTypes = this.getSelectedPlaces();
    const places = this.getFilteredPlaces(placesInTime, selectedPlaceTypes);

    return (
      <div className="h-100 d-flex flex-column Map position-relative">
        <MobileAlert />
        <SideMenu />
        <div className="flex-grow-0 flex-shrink-0 border-bottom title">
          <div className="container-fluid">
            <div className="row">
              <div className="col">
                <div className="top-bar d-flex align-items-center">
                  <h2 className="text-white m-0">
                    {story ? story.data.title : ""}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-grow-0 flex-shrink-0 border-bottom title">
          <div className="container-fluid">
            <div className="row">
              <div className="col">
                <MapHeader
                  t={t}
                  showOpacity={mapboxRasters.length > 0}
                  placeTypesCount={placeTypesCount}
                  opacity={this.state.opacity}
                  onOpacityChange={this.handleOnOpacityChange}
                  selectedPlaceTypes={selectedPlaceTypes}
                  toggleSelectedPlace={this.toggleSelectedPlace}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-shrink-1 flex-grow-1 d-flex">
          <div
            className="row no-gutters flex-1"
            style={{ position: "relative" }}
          >
            <TimeSeries
              t={t}
              extent={extent}
              year={currentDate ? currentDate.getFullYear() : null}
              columns={get(timeSeries, "columns", []).slice(1)}
              series={timeSeriesByIndicator}
            />
            <div
              className="col-md-3"
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                pointerEvents: selectedPlace ? undefined : "none"
              }}
            >
              <Legend
                story={story}
                selectedPlace={selectedPlace}
                onClose={this.closePlaceDetail}
              />
            </div>
            <div
              className="d-flex flex-1 w-100 flex-column bg-darkgrey"
              style={{ overflow: "hidden" }}
              ref={node => (this.mapContainer = node)}
            >
              {width > 0 && (
                <MapGL
                  {...viewport}
                  style={{ width: "100%", height: "100%" }}
                  maxZoom={16}
                  minZoom={7.5}
                  accessToken="pk.eyJ1IjoiZ2lvcmdpb3Vib2xkaSIsImEiOiJjamI4NWd1ZWUwMDFqMndvMzk1ODU3NWE2In0.3bX3jRxCi0IaHbmQTkQfDg"
                  mapStyle="mapbox://styles/giorgiouboldi/cjalcurkr00os2soczuclhjxl"
                  height={height}
                  width={width}
                  onViewportChange={this.updateViewport}
                  ref={r => {
                    this.mapRef = r;
                  }}
                >
                  {/* <div style={{ position: "absolute", right: 5, top: 5 }}>
                    <NavigationControl onViewportChange={this.updateViewport} />
                  </div> */}
                  {currentDate && (
                    <CurrentYear year={currentDate.getFullYear()} />
                  )}
                  {places && (
                    <Cluster
                      maxZoom={11}
                      radius={40}
                      extent={512}
                      nodeSize={64}
                      innerRef={ref => this.setState({ supercluster: ref })}
                      element={ClusterElement}
                    >
                      {places.map(place => {
                        let fill = "white";
                        if (place.data.place_type === "office") {
                          fill = place.open ? "#13d436" : "#ED6347";
                        }
                        return (
                          <Marker
                            key={
                              /*selectedPlace ? `selected-${place.id}` : place.id*/
                              `place-${place.id}`
                            }
                            longitude={place.coordinates[0]}
                            latitude={place.coordinates[1]}
                            element={
                              <div onClick={() => this.selectPlace(place)}>
                                <div
                                  onMouseEnter={() => setOverPlace(place)}
                                  onMouseLeave={() => clearOverPlace()}
                                  className={classNames(
                                    "place-marker d-flex align-items-center justify-content-center",
                                    {
                                      "place-selected": selectedPlace
                                        ? selectedPlace.id == place.id
                                        : false,
                                      "place-clickable":
                                        place.data.place_type === "office"
                                    }
                                  )}
                                  style={{ backgroundColor: fill }}
                                >
                                  <i className="material-icons">
                                    {MAP_ICON[place.data.place_type]}
                                  </i>
                                </div>
                              </div>
                            }
                          />
                        );
                      })}
                    </Cluster>
                  )}

                  {overPlace && (
                    <Popup
                      latitude={overPlace.coordinates[1]}
                      longitude={overPlace.coordinates[0]}
                      tipSize={0}
                      closeOnClick={false}
                      closeButton={false}
                      offset={[0, -10]}
                      anchor="bottom"
                      element={
                        <MapTooltip t={this.props.t} place={overPlace} />
                      }
                    />
                  )}

                  {mapboxSources.map(source => (
                    <Source
                      key={source.get("id")}
                      id={source.get("id")}
                      source={source}
                    />
                  ))}
                  {mapboxRasters &&
                    mapboxRasters.length > 0 &&
                    mapboxRasters.map((rasterLayer, i) => (
                      <Layer key={rasterLayer.get("id")} layer={rasterLayer} />
                    ))}
                </MapGL>
              )}
            </div>
          </div>
        </div>
        <div className="flex-grow-0 flex-shrink-0 border-top timeline-container">
          <div className="container-fluid">
            <div className="row">
              <div className="col">
                {places && (
                  <TimelineNavigationMap rasterLayers={rasterLayers} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  story: getStory(state),
  placesInTime: getPlacesInDate(state),
  placeTypesCount: getPlaceTypesCount(state),
  overPlace: getMapOverPlace(state),
  selectedPlace: getMapSelectedPlace(state),
  currentDate: getMapTimelineCurrentDate(state),
  currentDateRaw: state.map.currentDate,
  extent: getPlacesExtent(state),
  timeSeries: getTimeSeries(state),
  timeSeriesByIndicator: getTimeSeriesByIndicator(state),
  rasterLayers: getRasterLayers(state)
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
    setDateTimelineMap,
    loadRasterLayers,
    unloadRasterLayers
  }
)(localize()(Map));