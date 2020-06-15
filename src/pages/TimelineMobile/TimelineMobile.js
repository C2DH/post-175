import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { uniq } from "lodash";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { localize } from "../../localize";
import {
  loadEvents,
  unloadEvents,
  loadPeriods,
  unloadPeriods,
  unloadTimeline,
  clearSelectedEvent,
  selectEvent,
  setDateTimeline,
  loadStory,
  unloadStory,
  setCategoriesTimeline,
  setMilestoneTimeline
} from "../../state/actions";
import {
  getStory,
  getEvents,
  getFilteredEvents,
  getPeriods,
  getSelectedEvent,
  getTimelinePrevEvent,
  getTimelineNextEvent,
  getEventsExtent,
  getTimelineCurrentDate
} from "../../state/selectors";
import {
  getQsSafeYear,
  makeUrlWithYearAndFilters,
  getQsSafeCategories,
  getQsSafeMilestone
} from "../../utils";
import MobileAlert from "../../components/MobileAlert";
import Period from "../../components/Period";
import TimelineNavigation from "../../components/TimelineNavigation";
import TimelineFiltersMobile from "../../components/TimelineFiltersMobile";
import TimelineViz from "../../components/TimelineMobile";
import SideMenu from "../../components/SideMenu";
import { TransitionMotion, Motion, spring } from "react-motion";
import EventModal from "../../components/EventModal";
import Spinner from "../../components/Spinner";
import "./TimelineMobile.scss";

class TimelineMobile extends PureComponent {
  state = {
    modal: true,
    filters: false
  };

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  };

  toggleFilter = () => {
    this.setState(prevState => ({
      filters: !prevState.filters
    }));
  };

  componentDidMount() {
    let visited = sessionStorage["timelineAlreadyVisited"];
    if (visited) {
      this.setState({ modal: false });
    } else {
      sessionStorage["timelineAlreadyVisited"] = true;
      this.setState({ modal: true });
    }
    this.props.loadEvents({ detailed: true });
    this.props.loadPeriods();
    this.props.loadStory("timeline");
  }

  // TODO: Debounce for perforamance issues
  componentWillReceiveProps(nextProps) {
    // Init current date from query string
    if (
      this.props.extent !== nextProps.extent &&
      nextProps.extent &&
      !nextProps.currentDateRaw
    ) {
      let year = getQsSafeYear(this.props.location);
      const categories = getQsSafeCategories(this.props.location);
      if (categories.length > 0) {
        this.props.setCategoriesTimeline(categories);
      }
      const milestone = getQsSafeMilestone(this.props.location);
      this.props.setMilestoneTimeline(milestone);
      // When start \w milestone set the date to first milestone event...
      if (milestone) {
        year = Math.min(
          ...nextProps.events
            .filter(event => event.data.key_event)
            .map(e => e.startDate.getFullYear())
        );
      }
      const { extent } = nextProps;
      if (
        year &&
        year >= extent[0].getFullYear() &&
        year <= extent[1].getFullYear()
      ) {
        this.props.setDateTimeline(new Date(`${year}`));
      } else {
        this.props.history.replace(
          makeUrlWithYearAndFilters(
            this.props.location,
            nextProps.currentDate.getFullYear()
          )
        );
      }
    } else if (
      (nextProps.currentDate &&
        this.props.currentDate &&
        this.props.currentDate.getFullYear() !==
          nextProps.currentDate.getFullYear() &&
        this.props.currentDateRaw) ||
      this.props.categories !== nextProps.categories ||
      this.props.milestone !== nextProps.milestone
    ) {
      if (nextProps.currentDate) {
        this.props.history.replace(
          makeUrlWithYearAndFilters(
            this.props.location,
            nextProps.currentDate.getFullYear(),
            nextProps.categories,
            nextProps.milestone
          )
        );
      }
    }
  }

  componentWillUnmount() {
    this.props.unloadEvents();
    this.props.unloadPeriods();
    this.props.unloadTimeline();
    this.props.unloadStory();
    // Clear the event open as modal...
    this.props.selectEvent(null);
  }

  goNext = () => {
    const { selectEvent, setDateTimeline, nextEvent } = this.props;
    setDateTimeline(nextEvent.startDate);
    selectEvent(nextEvent);
  };

  goPrev = () => {
    const { selectEvent, setDateTimeline, prevEvent } = this.props;
    setDateTimeline(prevEvent.startDate);
    selectEvent(prevEvent);
  };

  render() {
    const {
      location,
      events,
      periods,
      selectedEvent,
      nextEvent,
      prevEvent,
      clearSelectedEvent,
      story,
      t
    } = this.props;
    return (
      <div className="h-100 d-flex flex-column TimelineMobile position-relative">
        <TimelineFiltersMobile
          open={this.state.filters}
          toggle={this.toggleFilter}
        ></TimelineFiltersMobile>
        {events === null && <Spinner firstLoading screen="timeline" />}
        <SideMenu />
        <div className="flex-grow-0 flex-shrink-0 border-bottom title">
          <div className="container-fluid">
            <div className="row">
              <div className="col">
                <div className="top-bar d-flex align-items-center">
                  <h4 className="text-white m-0 w-100 pl-5 text-truncate">
                    {story ? story.data.title : ""}
                  </h4>
                  <div className="d-flex">
                    <i
                      onClick={this.toggleFilter}
                      className="material-icons text-white"
                    >
                      filter_list
                    </i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-shrink-1 flex-grow-1 d-flex">
          {events && <TimelineViz events={events} />}
        </div>

        <TransitionMotion
          defaultStyles={
            selectedEvent
              ? [
                  {
                    key: "eventModal",
                    data: { selectedEvent, nextEvent, prevEvent },
                    style: { o: 0 }
                  }
                ]
              : []
          }
          styles={
            selectedEvent
              ? [
                  {
                    key: "eventModal",
                    data: { selectedEvent, nextEvent, prevEvent },
                    style: { o: spring(1) }
                  }
                ]
              : []
          }
          willLeave={() => ({ o: spring(0) })}
          willEnter={() => ({ o: 0 })}
        >
          {interpolatedStyles => (
            <div>
              {interpolatedStyles.map(config => {
                return (
                  <EventModal
                    style={{ opacity: config.style.o }}
                    key={config.key}
                    hasNext={config.data.nextEvent !== null}
                    hasPrev={config.data.prevEvent !== null}
                    goNext={this.goNext}
                    goPrev={this.goPrev}
                    event={config.data.selectedEvent}
                    onClose={clearSelectedEvent}
                  />
                );
              })}
            </div>
          )}
        </TransitionMotion>

        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          size={"lg"}
          className="page-modal"
        >
          <ModalHeader toggle={this.toggle}>{t("help_time").title}</ModalHeader>
          <ModalBody>
            <ul>
              {t("help_time").list &&
                t("help_time").list.map(elm => {
                  return (
                    <li key={elm.title}>
                      <strong>{elm.title}</strong>
                      {elm.paragraphs.map((p, i) => {
                        return (
                          <p key={i} className="mb-1">
                            {p}
                          </p>
                        );
                      })}
                    </li>
                  );
                })}
            </ul>
            <h5 className="mt-4">{t("help_time").navigation_title}</h5>
            {t("help_time").navigation_list &&
              t("help_time").navigation_list.map((p, i) => {
                return (
                  <p key={i} className="mb-1">
                    {p}
                  </p>
                );
              })}
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  //events: getEvents(state),
  events: getFilteredEvents(state),
  periods: getPeriods(state),
  selectedEvent: getSelectedEvent(state),
  nextEvent: getTimelineNextEvent(state),
  prevEvent: getTimelinePrevEvent(state),
  extent: getEventsExtent(state),
  currentDate: getTimelineCurrentDate(state),
  currentDateRaw: state.timeline.currentDate,
  categories: state.timeline.categories,
  milestone: state.timeline.milestone,
  story: getStory(state)
});
export default connect(
  mapStateToProps,
  {
    loadEvents,
    unloadEvents,
    loadPeriods,
    unloadPeriods,
    unloadTimeline,
    setDateTimeline,
    clearSelectedEvent,
    selectEvent,
    loadStory,
    unloadStory,
    setCategoriesTimeline,
    setMilestoneTimeline
  }
)(localize()(TimelineMobile));
