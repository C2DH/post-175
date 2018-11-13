import React, { PureComponent } from "react";
import classNames from "classnames";
import get from "lodash/get";
import { connect } from "react-redux";
import { localize } from "../localize";
import {
  toggleCategoryTimeline,
  toggleTimelineMilestone
} from "../state/actions";
import { getEventsCateogryCounts } from "../state/selectors";
import { EVENT_COLORS } from "../consts";

class TimelineFilters extends PureComponent {
  render() {
    const {
      categories,
      milestone,
      toggleCategoryTimeline,
      toggleTimelineMilestone,
      categoriesCount,
      t
    } = this.props;

    return (
      // TODO: custom css
      <div
        className="bg-black d-flex p-3 justify-content-between border-bottom border-right"
        style={{ height: 56 }}
      >
        <div className="d-flex align-items-center">
          <div>CATEGORIES:</div>
          <div className="px-3 d-flex align-items-center">
            {Object.keys(EVENT_COLORS).map(name => (
              <div
                onClick={() => toggleCategoryTimeline(name)}
                key={name}
                className={classNames(
                  "d-flex align-items-center pointer timeline-category-filter",
                  {
                    "timeline-category-filter-active":
                      categories.indexOf(name) !== -1
                  }
                )}
              >
                <svg height={14} width={14}>
                  <circle r={7} cx={7} cy={7} fill={EVENT_COLORS[name]} />
                </svg>
                <div className="ml-1 mr-3">
                  {t(name)} {get(categoriesCount, name, "")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TODO: use a shit like that https://haubek.github.io/custom-switch/ */}
        <div className="d-flex align-items-center">
          <span>All events</span>
          <span className="switch switch-sm">
            <input
              type="checkbox"
              checked={milestone}
              onChange={() => toggleTimelineMilestone()}
              className="switch"
              id="milestone-switch"
            />
            <label htmlFor="milestone-switch">Milestones</label>
          </span>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    categories: state.timeline.categories,
    milestone: state.timeline.milestone,
    categoriesCount: getEventsCateogryCounts(state)
  }),
  {
    toggleCategoryTimeline,
    toggleTimelineMilestone
  }
)(localize()(TimelineFilters));
