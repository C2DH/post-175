import React from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import {
  getLangs,
  getSelectedLang,
  getMakeLangUrl
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
  t
}) => {
  const related = doc.documents.filter(d =>
    COLLECTION_DATE_TYPES.includes(d.data.type)
  );

  return (
    <div className="doc-detail d-flex w-100 h-100">
      <div className="doc-detail-bar border-right">
        <div
          className="close-icon w-100 d-flex justify-content-center align-items-center"
          onClick={onClose}
        >
          <i className="material-icons">subdirectory_arrow_right</i>
        </div>
        <HomeMenu className="position-relative" />
      </div>
      <div className="doc-detail-data">
        <div className="container-fluid h-100 px-0">
          <div className="row no-gutters h-100">
            <div className="col-md-4 h-100 d-flex">
              <div className="doc-detail-info w-100">
                <div className="p-3 w-100 border-bottom">
                  <h6 className="detail-title">{t("title")}</h6>
                  <h4 className="doc-title">{doc.data.title}</h4>
                </div>
                {doc.data.description && (
                  <div className="p-3 w-100 border-bottom">
                    <h6 className="detail-title">{t("description")}</h6>
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
                            <Link to={`/doc/${relatedDoc.id}`}>
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
            <div className="col-md-8">
              <DocMedia doc={doc} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(
  connect(state => ({
    url: getMakeLangUrl(state),
    langs: getLangs(state),
    selectedLang: getSelectedLang(state)
  }))(localize()(DocDetail))
);
