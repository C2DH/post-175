import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { localize } from "../localize";
import get from "lodash/get";
import mapboxgl from "mapbox-gl";
import Immutable from "immutable";
import memoize from "memoize-one";
import qs from 'query-string'
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
  loadRasterLayers,
  unloadRasterLayers
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
  getRasterLayers,
  getPlaceTypesCount
} from "../state/selectors";
import { getQsSafeYear, makeUrlWithYear } from "../utils";
import TimelineNavigationMap from "../components/TimelineNavigationMap";
import MobileAlert from "../components/MobileAlert";
import MapTooltip from "../components/MapTooltip";
import SideMenu from "../components/SideMenu";
import { scaleLinear } from "d3-scale";
import { Motion, TransitionMotion, spring, presets } from "react-motion";
import { Text } from "@vx/text";

const circleScale = scaleLinear()
  .range([30, 100])
  .domain([1, 184]);

// TODO: Style that bitch
const CurrentYear = ({ year }) => <h1 className="map-year">{year}</h1>;

const ClusterElement = ({ properties: { point_count_abbreviated }, style }) => {
  const r = circleScale(point_count_abbreviated);
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
        {point_count_abbreviated}
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
  toggleSelectedPlace,
}) => {
  const counts = ["office", "central", "telegraph"]
    .map(type => ({
      label: type,
      count: placeTypesCount[type]
    }))
    .filter(({ count }) => count);
  return (
    <div>
      <div className="bg-black" style={{ height: 50 }}>
        <h1 className="text-white">{t("Carte")}</h1>
      </div>
      <div className="d-flex justify-content-between">
        <div className="text-white d-flex" style={{ height: 50 }}>
          {counts.map(({ label, count }) => (
            <div key={label}>
              <span>
                <input
                  type='checkbox'
                  checked={selectedPlaceTypes.indexOf(label) !== -1}
                  onChange={() => toggleSelectedPlace(label)}
                />
                {label} {`(${count})`}
              </span>
            </div>
          ))}
        </div>
        {showOpacity && (
          <div>
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
    </div>
  );
};

class MapPage extends PureComponent {
  state = {
    viewport: {
      longitude: 6.087,
      latitude: 49.667,
      zoom: 8
    },
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
        zoom: 13,
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
    return get(qs.parse(this.props.location.search), 'places', '')
      .split(',').filter(Boolean)
  }

  toggleSelectedPlace = place => {
    const { location } = this.props
    const places = this.getSelectedPlaces()
    let newPlaces
    if (places.indexOf(place) === -1) {
      newPlaces = places.concat(place)
    } else {
      newPlaces = places.filter(p => p !== place)
    }

    const qsAsObject = qs.parse(location.search)
    const newQs = qs.stringify({
      ...qsAsObject,
      places: newPlaces.join(','),
    }, {
      encode: false,
    })
    this.props.history.replace(`${location.pathname}?${newQs}`)
  }

  getFilteredPlaces = memoize((places, placeTypes) => {
    if (placeTypes.length === 0) {
      return places
    }
    return places.filter(place => {
      return placeTypes.indexOf(place.data.place_type) !== -1
    })
  })

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
    const selectedPlaceTypes = this.getSelectedPlaces()
    const places = this.getFilteredPlaces(placesInTime, selectedPlaceTypes)

    return (
      <div className="h-100">
        <SideMenu />
        <div className="h-100 with-sidemenu d-flex flex-column">
          <MapHeader
            t={t}
            showOpacity={mapboxRasters.length > 0}
            placeTypesCount={placeTypesCount}
            opacity={this.state.opacity}
            onOpacityChange={this.handleOnOpacityChange}
            selectedPlaceTypes={selectedPlaceTypes}
            toggleSelectedPlace={this.toggleSelectedPlace}
          />
          <div
            className="row no-gutters flex-1"
            style={{ position: "relative" }}
          >
            <TimeSeries
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
                  maxZoom={12}
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
                      element={ClusterElement}
                    >
                      {places.map(place => {
                        const isSelected = selectedPlace
                          ? place.id === selectedPlace.id
                          : false;
                        let fill = "white";
                        if (place.data.place_type === "office") {
                          fill = place.open ? "#13d436" : "#fdd00c";
                        }
                        return (
                          <Marker
                            key={
                              selectedPlace ? `selected-${place.id}` : place.id
                            }
                            longitude={place.coordinates[0]}
                            latitude={place.coordinates[1]}
                            element={
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
                                      fill={fill}
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
                                      stroke={
                                        place.open ? "#13d436" : "#fdd00c"
                                      }
                                    />
                                  </svg>
                                )}
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
                      anchor="bottom"
                      closeButton={false}
                      offsetBottom={15}
                      element={
                        <MapTooltip
                          t={this.props.t}
                          // style={{ opacity: config.style.o }}
                          style={{ opacity: 1 }}
                          place={overPlace}
                        />
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
          {places && <TimelineNavigationMap rasterLayers={rasterLayers} />}
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
)(localize()(MapPage));
