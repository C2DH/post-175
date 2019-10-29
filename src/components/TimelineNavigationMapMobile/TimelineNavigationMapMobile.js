import React, { PureComponent, Fragment } from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import { ScrollToHOC } from "react-scroll-to";
import {
  getPlacesExtent,
  getMapTimelineCurrentDate
} from "../../state/selectors";
import { setDateTimelineMap } from "../../state/actions";
import { timeYear } from "d3-time";
import TimelineNavigationControlled, {
  TimelineTicks
} from "../TimelineNavigationControlled";
import "./TimelineNavigationMapMobile.scss";

const yearWidth = 150;

class TimelineNavigationMap extends PureComponent {
  myRef = React.createRef();

  componentDidMount() {
    if (this.props.currentDate) {
      const { currentDate } = this.props;
      const yearIndex = timeYear
        .range(this.props.extent[0], this.props.extent[1])
        .findIndex(function(year) {
          return year.getFullYear() === currentDate.getFullYear();
        });

      this.props.scroll({ ref: this.myRef, x: yearIndex * yearWidth });
    }
  }

  render() {
    const {
      extent,
      currentDate,
      setDateTimelineMap,
      rasterLayers
    } = this.props;

    const years = extent ? timeYear.range(extent[0], extent[1]) : [];

    return (
      <div className="TimelineNavigationMapMobile">
        <div
          ref={this.myRef}
          className="d-flex flex-nowrap overflow-auto position-relative decadesContainer"
        >
          {years.map((year, i) => {
            return (
              <div
                className={classnames("year", {
                  active: year.getFullYear() === currentDate.getFullYear()
                })}
                style={{ minWidth: yearWidth, maxWidth: yearWidth }}
                key={i}
                onClick={() => setDateTimelineMap(year)}
              >
                <div className="d-flex align-items-center">
                  {rasterLayers
                    .filter(
                      layer =>
                        new Date(layer.data.start_date).getFullYear() ===
                        year.getFullYear()
                    )
                    .map(layer => (
                      <div key={layer.id} className="raster">
                        <i className="material-icons">image</i>
                      </div>
                    ))}
                </div>
                <div>{year.getFullYear()}</div>
              </div>
            );
          })}
        </div>
      </div>
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
)(ScrollToHOC(TimelineNavigationMap));
