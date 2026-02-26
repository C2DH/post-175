import React, { PureComponent } from "react";
import { get } from "lodash";
import { connect } from "react-redux";
import { localize } from "../../localize";
import { clearOverPlace } from "../../state/actions";
import "./MapTooltip.scss";

const colors = {
  red: {
    color: "#ED6347"
  },
  green: {
    color: "#13d436"
  }
};

class MapTooltip extends PureComponent {
  render() {
    const { place, style, t } = this.props;
    return (
      <div style={{ ...style }} className="MapTooltip d-flex text-white">
        {get(place, "documents[0].data.resolutions.low.url", null) && (
          <div className="place-img">
            <img
              src={get(place, "documents[0].data.resolutions.low.url", null)}
            />
          </div>
        )}
        <div className="h-100 p-2">
          {place.open ? (
            <p className="my-1" style={colors.green}>
              {t("map_mapTooltipOpen")}
            </p>
          ) : (
            <p className="my-1" style={colors.red}>
              {t("map_mapTooltipClose")}
            </p>
          )}
          <h4>{place.data.title}</h4>

          <p className="my-0">
            <i className="material-icons font-12 mr-1">place</i>
            {place.data.address}
          </p>
          <p className="text-white-50 my-0">
            {place.data.start_date && (
              <span>
                {t("map_mapTooltipFrom")}{" "}
                {new Date(place.data.start_date).getFullYear()}
              </span>
            )}
            {place.data.end_date && (
              <span>
                {" "}
                {t("map_mapTooltipTo")}{" "}
                {new Date(place.data.end_date).getFullYear()}
              </span>
            )}
          </p>
        </div>
      </div>
    );
  }
}

// export default localize()(MapTooltip)
export default MapTooltip;
