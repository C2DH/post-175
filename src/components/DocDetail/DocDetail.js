import React from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import {
  getLangs,
  getSelectedLang,
  getMakeLangUrl,
} from "../../state/selectors";
import DocMedia from "./DocMedia";
import HomeMenu from "../HomeMenu";
import DocDate from "../DocDate";
import { localize } from "../../localize";
import { COLLECTION_DATE_TYPES } from "../../consts";
import "./DocDetail.scss";

const DocDetail = ({
  doc,
  onClose,
  langs,
  selectedLang,
  url,
  location,
  history,
  t,
}) => {
  const related = doc.documents.filter((d) =>
    COLLECTION_DATE_TYPES.includes(d.data.type)
  );

  return (
    <div className="doc-detail d-flex w-100 h-100">
      <div className="doc-detail-bar border-right d-none d-md-flex">
        <div
          className="close-icon w-100 d-flex justify-content-center align-items-center"
          onClick={onClose}
        >
          <i className="material-icons">subdirectory_arrow_right</i>
        </div>
        <HomeMenu className="position-relative d-none d-md-block" />
      </div>
      <div className="doc-detail-data">
        <div className="container-fluid h-100 px-0">
          <div className="row no-gutters h-100 flex-column flex-lg-row">
            <div className="d-block d-md-none close-container">
              <div
                className="d-flex justify-content-center align-items-center text-white"
                onClick={onClose}
              >
                <i className="ml-auto material-icons">close</i>
              </div>
            </div>
            <div className="doc-detail-info-container col-lg-4 d-flex order-1 order-lg-0">
              <div className="doc-detail-info w-100">
                <div className="px-3 pt-3 pb-1 p-lg-3 w-100">
                  <h6 className="detail-title d-none d-lg-block">
                    {t("title")}
                  </h6>
                  <h4 className="doc-title">{doc.data.title}</h4>
                </div>

                {doc.type === "360viewer" && (
                  <div className="d-block d-md-none p-3 w-100 border-bottom">
                    <h6 className="detail-title">{t("external_viewer")}</h6>
                    <p>
                      <a className="external-viewer" href={doc.url}>
                        {t("link")}
                      </a>
                    </p>
                  </div>
                )}

                {doc.data.description && (
                  <div className="px-3 pt-1 pb-3 p-lg-3 w-100 border-bottom">
                    <h6 className="detail-title d-none d-lg-block">
                      {t("description")}
                    </h6>
                    <p>{doc.data.description}</p>
                  </div>
                )}
                <div className="p-3 w-100 border-bottom">
                  <h6 className="detail-title">{t("date")}</h6>
                  <p>
                    <DocDate
                      startDate={doc.data.start_date}
                      endDate={doc.data.end_date}
                      year={doc.data.year}
                      date={doc.data.date}
                    />
                  </p>
                </div>
                {doc.data.creator && (
                  <div className="p-3 w-100 border-bottom">
                    <h6 className="detail-title">{t("creator")}</h6>
                    <p>{doc.data.creator}</p>
                  </div>
                )}
                {doc.data.provenance && (
                  <div className="p-3 w-100 border-bottom">
                    <h6 className="detail-title">{t("provenance")}</h6>
                    <p className="text-break">{doc.data.provenance}</p>
                  </div>
                )}
                {related.length > 0 && (
                  <div className="p-3 w-100">
                    <h6 className="detail-title">{t("related_documents")}</h6>
                    <div className="d-flex flex-wrap w-100">
                      {related &&
                        related.map((relatedDoc, i) => (
                          <div key={relatedDoc.id} className="square">
                            <Link
                              to={{
                                pathname: `/doc/${relatedDoc.id}`,
                                search: `?lang=${selectedLang.param}`,
                              }}
                            >
                              {relatedDoc.data.resolutions ? (
                                <img
                                  src={relatedDoc.data.resolutions.low.url}
                                  className="square-content"
                                />
                              ) : (
                                <p className="square-content border m-0">
                                  {relatedDoc.data.title}
                                </p>
                              )}
                            </Link>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="doc-media-container col-lg-8">
              <DocMedia doc={doc} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(
  connect((state) => ({
    url: getMakeLangUrl(state),
    langs: getLangs(state),
    selectedLang: getSelectedLang(state),
  }))(localize()(DocDetail))
);
