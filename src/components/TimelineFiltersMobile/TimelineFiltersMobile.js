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
import "./TimelineFiltersMobile.scss";

class TimelineFiltersMobile extends PureComponent {
  render() {
    const {
      categories,
      milestone,
      toggleCategoryTimeline,
      toggleTimelineMilestone,
      categoriesCount,
      t,
      open,
      toggle
    } = this.props;

    return (
      // TODO: custom css
      <div className={classNames("TimelineFiltersMobile", { open: open })}>
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="d-flex flex-column text-white">
                <div className="top-bar d-flex align-items-center">
                  <h4 className="text-white m-0 w-100 text-truncate pl-5">
                    Filters
                  </h4>
                  <div className="d-flex">
                    <i
                      className="material-icons text-white"
                      onClick={() => toggle()}
                    >
                      close
                    </i>
                  </div>
                </div>

                <div className="d-flex flex-column">
                  {Object.keys(EVENT_COLORS).map(name => (
                    <div
                      onClick={() => toggleCategoryTimeline(name)}
                      key={name}
                      className={classNames(
                        "d-flex align-items-center category-filter w-100 py-3 border-bottom",
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

                {/* TODO: use a shit like that https://haubek.github.io/custom-switch/ */}
                <div className="d-flex align-items-center filter-switch mt-4">
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
            </div>
          </div>
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
)(localize()(TimelineFiltersMobile));
