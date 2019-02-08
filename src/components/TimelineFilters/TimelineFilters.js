import React, { PureComponent } from "react";
import classNames from "classnames";
import get from "lodash/get";
import { connect } from "react-redux";
import { localize } from "../../localize";
import {
  toggleCategoryTimeline,
  toggleTimelineMilestone
} from "../../state/actions";
import { getEventsCateogryCounts } from "../../state/selectors";
import { EVENT_COLORS } from "../../consts";
import "./TimelineFilters.scss";

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
      <div className="d-flex justify-content-between TimelineFilters text-white">
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center">
            {Object.keys(EVENT_COLORS).map(name => (
              <div
                onClick={() => toggleCategoryTimeline(name)}
                key={name}
                className={classNames(
                  "d-flex align-items-center category-filter mr-3",
                  {
                    active: categories.indexOf(name) !== -1
                  }
                )}
              >
                <svg height={18} width={18}>
                  <rect
                    height={10}
                    width={10}
                    x={4}
                    y={4}
                    fill={EVENT_COLORS[name]}
                  />
                  <rect
                    height={16}
                    width={16}
                    x={1}
                    y={1}
                    fill="none"
                    stroke="#6c757d"
                    rx="2"
                    ry="2"
                  />
                </svg>
                <div className="ml-1">
                  {t(name)} ({get(categoriesCount, name, "")})
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TODO: use a shit like that https://haubek.github.io/custom-switch/ */}
        <div className="d-flex align-items-center filter-switch">
          <span className="mr-2">{t("milestones_only")}</span>
          <span className="switch switch-sm">
            <input
              type="checkbox"
              checked={!milestone}
              onChange={() => toggleTimelineMilestone()}
              className="switch"
              id="milestone-switch"
            />
            <label htmlFor="milestone-switch">{t("all_events")}</label>
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
