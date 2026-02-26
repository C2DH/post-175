import React, { PureComponent, Fragment } from "react";
import { connect } from "react-redux";
import {
  getPlacesExtent,
  getMapTimelineCurrentDate
} from "../../state/selectors";
import { setDateTimelineMap } from "../../state/actions";
import TimelineNavigationControlled, {
  TimelineTicks
} from "../TimelineNavigationControlled";
import "./TimelineNavigationMap.scss";

class TimelineNavigationMap extends PureComponent {
  render() {
    const {
      extent,
      currentDate,
      setDateTimelineMap,
      rasterLayers
    } = this.props;

    return (
      <TimelineNavigationControlled
        currentDate={currentDate}
        onDateChange={setDateTimelineMap}
        extent={extent}
      >
        {({ width, height, scale, ticks }) => (
          <Fragment>
            <div
              className="text-white TimelineNavigationMap"
              style={{ flex: 1, position: "relative" }}
            >
              {rasterLayers
                .sort((a, b) => b.data.year - a.data.year)
                .map(layer => (
                  <div
                    onClick={() =>
                      setDateTimelineMap(new Date(layer.data.start_date))
                    }
                    key={layer.id}
                    style={{
                      left: scale(new Date(layer.data.start_date)) - 13
                    }}
                    className="raster d-flex align-items-center"
                  >
                    <i className="material-icons">image</i>
                  </div>
                ))}
            </div>
            <TimelineTicks
              onTickClick={tick => () => {
                setDateTimelineMap(tick);
              }}
              ticks={ticks}
              y={height / 4}
              scale={scale}
            />
          </Fragment>
        )}
      </TimelineNavigationControlled>
    );
  }
}

const mapStateToProps = state => ({
  currentDate: getMapTimelineCurrentDate(state),
  extent: getPlacesExtent(state)
});
export default connect(
  mapStateToProps,
  {
    setDateTimelineMap
  }
)(TimelineNavigationMap);
