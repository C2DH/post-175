import React, { PureComponent, Fragment } from "react";
import { connect } from "react-redux";
import { getPlacesExtent, getMapTimelineCurrentDate } from "../state/selectors";
import { setDateTimelineMap } from "../state/actions";
import TimelineNavigationControlled, {
  TimelineTicks
} from "./TimelineNavigationControlled";

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
              className="text-white"
              style={{ flex: 1, position: "relative" }}
            >
              {rasterLayers.map(layer => (
                <div
                  onClick={() =>
                    setDateTimelineMap(new Date(layer.data.start_date))
                  }
                  key={layer.id}
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    left: scale(new Date(layer.data.start_date)) - 13,
                    top: 5
                  }}
                  className="d-flex align-items-center"
                >
                  <i className="material-icons">image</i>
                </div>
              ))}
            </div>
            <TimelineTicks ticks={ticks} y={height / 4} scale={scale} />
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
