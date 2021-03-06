import React, { PureComponent } from "react";
import { find, head, get } from "lodash";
import { Link } from "react-router-dom";
import { getEventColor } from "../../utils";
import { localize } from "../../localize";
import ZoomAndPanMedia from "../ZoomAndPanMedia";
import { connect } from "react-redux";
import { getSelectedLang } from "../../state/selectors";
import "./EventModal.scss";
import classNames from "classnames";

const EventType = ({ event }) => {
  const color = getEventColor(event);
  return (
    <div className="d-inline-flex">
      <svg width={20} height={20}>
        <circle cx="10" cy="10" r={8} fill={color} />
      </svg>
      <span className="font-12 ml-2" style={{ color: color, paddingTop: 2 }}>
        {event.data.category_label}
      </span>
    </div>
  );
};

const EventsControl = ({ hasPrev, hasNext, goNext, goPrev, t }) => (
  <div className="w-100 d-flex flex-lg-column order-0 order-md-1">
    <button
      className="btn d-flex w-100 align-items-center justify-content-center"
      onClick={goPrev}
      disabled={!hasPrev}
    >
      <i className="material-icons">arrow_back</i>
    </button>
    <button
      className="btn d-flex w-100 align-items-center justify-content-center"
      onClick={goNext}
      disabled={!hasNext}
    >
      <i className="material-icons">arrow_forward</i>
    </button>
  </div>
);

class EventModal extends PureComponent {
  state = {
    selectedDocument: null,
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.event !== nextProps.event) {
      this.setState({ selectedDocument: null });
    }
  }

  handleSelectDocument = (selectedDocument) => () => {
    this.setState({ selectedDocument });
  };

  render() {
    const {
      event,
      onClose,
      hasPrev,
      hasNext,
      goNext,
      goPrev,
      style,
      t,
      selectedLang,
    } = this.props;

    // Take only docs \w resolution
    const displayDocs = get(event, "documents", []).filter(
      (d) => d.data.resolutions
    );
    const selectedDocument = this.state.selectedDocument
      ? this.state.selectedDocument
      : head(displayDocs);

    return (
      <div className="EventModal fixed-top fixed-bottom" style={style}>
        <div className="container h-100">
          <div className="row h-100 no-gutters justify-content-lg-center align-items-lg-center flex-column flex-lg-row">
            {displayDocs.length > 0 && (
              <div className="col-lg-7 flex-column d-flex doc-container">
                <div
                  className="w-100 flex-1 p-1 p-md-5"
                  style={{ minHeight: 0 }}
                >
                  <img
                    src={selectedDocument.data.resolutions.medium.url}
                    width="100%"
                    height="100%"
                    className="img-preview"
                  />
                </div>
                <div className="p-1 p-md-3 w-100 text-white d-flex align-items-center doc-container-info">
                  <div className="px-3 d-none d-lg-block">
                    <p className="date text-white-50">
                      {get(selectedDocument, "data.year")}
                    </p>
                    <p className="text-white description">
                      {get(selectedDocument, "data.title")}
                    </p>
                  </div>
                  <div className="px-3 align-self-end mx-auto ml-lg-auto mr-lg-0">
                    <p>
                      <Link
                        className="collection-link"
                        to={{
                          pathname: `/doc/${selectedDocument.id}`,
                          search: `?lang=${selectedLang.param}`,
                          state: { modal: true },
                        }}
                      >
                        {t("open")}
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div
              className={classNames(
                `d-flex event-info flex-column flex-lg-row`,
                {
                  "col-lg-5": displayDocs.length > 0,
                  "col-lg-6": displayDocs.length === 0,
                  "height-100": displayDocs.length > 0,
                  // "h-100": displayDocs.length > 0
                }
              )}
            >
              <div className="flex-grow-1 flex-shrink-1 border-right event-info-container order-1 order-lg-0">
                <div className="p-3 w-100 border-bottom">
                  <EventType event={event} />
                  <h4>{event.data.title}</h4>
                  <p className="text-black-50 mb-0">{event.data.start_date}</p>
                </div>
                <div className="p-3 w-100 border-bottom">
                  <p>{event.data.description}</p>
                </div>
                {displayDocs.length > 1 && (
                  <div className="w-100 p-3">
                    <h6 className="related-title">{t("related_documents")}</h6>
                    <div className="d-flex flex-wrap w-100">
                      {displayDocs &&
                        displayDocs.map((doc, i) => (
                          <div
                            key={doc.id}
                            className={classNames(`square`, {
                              selected: doc.id === selectedDocument.id,
                            })}
                          >
                            <img
                              src={doc.data.resolutions.low.url}
                              className="square-content"
                              onClick={this.handleSelectDocument(doc)}
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="action-bar flex-grow-0 flex-shrink-0 d-flex d-lg-block">
                <button
                  onClick={onClose}
                  className="btn d-flex w-25 w-md-100 align-items-center justify-content-center order-1 order-md-0"
                >
                  <i className="material-icons">close</i>
                </button>
                <EventsControl
                  hasNext={hasNext}
                  hasPrev={hasPrev}
                  goNext={goNext}
                  goPrev={goPrev}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default localize()(
  connect((state) => ({
    selectedLang: getSelectedLang(state),
  }))(EventModal)
);
