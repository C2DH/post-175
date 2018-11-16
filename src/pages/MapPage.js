import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { localize } from '../localize'
import get from 'lodash/get'
import mapboxgl from 'mapbox-gl'
import Immutable from 'immutable';
// import ReactMapGL, {
//   NavigationControl,
//   Marker,
//   HTMLOverlay,
//   Popup,
//   FlyToInterpolator
// } from "react-map-gl";
import MapGL, { Marker, Popup, Layer } from '@urbica/react-map-gl';

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
  unloadRasterLayers,
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
} from "../state/selectors";
import { getQsSafeYear, makeUrlWithYear } from "../utils";
import TimelineNavigationMap from "../components/TimelineNavigationMap";
import MobileAlert from "../components/MobileAlert";
import MapTooltip from "../components/MapTooltip";
import SideMenu from '../components/SideMenu'
import { Motion, TransitionMotion, spring, presets } from "react-motion";

// TODO: Style that bitch
const CurrentYear = ({ year }) => <h1 className="map-year">{year}</h1>;
console.log("xx", mapboxgl)

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
    this.props.loadRasterLayers({})
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
    if(oldProps.rasterLayers !== this.props.rasterLayers){
      console.log("rasterLayers",this.props.rasterLayers)
    }
    if(this.mapRef && !this.hasNavigation){
      const map = this.mapRef.getMap()
      console.log("maaap", map)
      map.addControl(new mapboxgl.NavigationControl())
      this.hasNavigation = true
    }
  }

  addRasterLayersToMap = (layers) => {
    console.log("123", this.mapRef)
    if(this.mapRef){
      const map = this.mapRef.getMap()
      console.log(map)
      map.addLayer({
        id: 'raster-layer',
        type: 'raster',
        source: {
          type: 'raster',
          tiles: ['https://api.mapbox.com/v4/RASTER_LAYER/{z}/{x}/{y}@2x.png?access_token=pk.eyJ1IjoidGVvIiwiYSI6IllvZUo1LUkifQ.dirqtn275pAKdnqtLM2HSw'],
        },
        paint: {"raster-opacity": 0.50},
        minzoom: 0,
        maxzoom: 22
      });
    }
  }

  componentWillUnmount() {
    this.props.unloadStory()
    this.props.unloadPlaces()
    this.props.unloadMap()
    this.props.unloadTimeSeries()
    this.props.unloadRasterLayers()
    window.removeEventListener("resize", this.setMapSize)
  }

  setMapSize = () => {
    this.setState({
      width: this.mapContainer.offsetWidth,
      height: this.mapContainer.offsetHeight,
    });
  };

  selectPlace = place => {
    this.props.setSelectedPlace(place)
    this.updateViewport({
      latitude: place.coordinates[1],
      longitude: place.coordinates[0],
      zoom: 13,
      // transitionInterpolator: new FlyToInterpolator(),
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
      timeSeriesByIndicator,
      extent,
      rasterLayers
    } = this.props;

    console.log("width", width)
    const mapboxRasters = rasterLayers ? rasterLayers.map(l => Immutable.fromJS({
      id: l.id.toString(),
      type: 'raster',
      source: {
        type: 'raster',
        tiles: [`https://api.mapbox.com/v4/${l.data.raster_layer}/{z}/{x}/{y}@2x.png?access_token=pk.eyJ1IjoiZ2lvcmdpb3Vib2xkaSIsImEiOiJjamI4NWd1ZWUwMDFqMndvMzk1ODU3NWE2In0.3bX3jRxCi0IaHbmQTkQfDg`],
      },
      paint: {"raster-opacity": 0.50},
      layout: { visibility: true },
      minzoom: 0,
      maxzoom: 22
    })) : []

    return (
      <div className="h-100">
        <SideMenu />
        <div className='h-100 with-sidemenu d-flex flex-column'>
          <div style={{ height: 50 }} className='bg-info' />
          <div className='row no-gutters flex-1'>
            <TimeSeries
              extent={extent}
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
                  ref={r => {this.mapRef = r; console.log("mapref", r)}}
                >
                  {/* <div style={{ position: "absolute", right: 5, top: 5 }}>
                    <NavigationControl onViewportChange={this.updateViewport} />
                  </div> */}
                  {currentDate && (
                    <CurrentYear year={currentDate.getFullYear()} />
                  )}
                  {places &&
                    places.map(place => {
                      const isSelected = selectedPlace
                        ? place.id === selectedPlace.id
                        : false;
                      return (
                        <Marker
                          key={place.id}
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
                          }
                        >

                        </Marker>
                      );
                    })}

                    {overPlace && <Popup
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
                    >
                    </Popup>}

                    {mapboxRasters && mapboxRasters.length > 0 && mapboxRasters.map((rasterLayer, i) => (
                      <Layer key={i} layer={rasterLayer}/>
                    ))}

                </MapGL>
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
  rasterLayers: getRasterLayers(state),
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
    unloadRasterLayers,
  }
)(localize()(MapPage));
