import React, { memo } from "react";
import { Link } from "react-router-dom";
import LinesEllipsis from "react-lines-ellipsis";
import DocDate from "../DocDate";
import SideDocumentMedia from "./SideDocumentMedia";

export default memo(function SideDocument({ doc, stopPlaying, t }) {
  return (
    <div className="side-document">
      {doc && (
        <div className="display-doc text-white">
          <div className="col-6 py-2">
            <SideDocumentMedia doc={doc} />
          </div>
          <div className="title-doc col-6 pt-2">
            <div>
              <p className=" mb-0 text-white-50">
                <DocDate
                  startDate={doc.data.start_date}
                  endDate={doc.data.end_date}
                  year={doc.data.year}
                  date={doc.data.date}
                />
              </p>

              <h6 style={{ whiteSpace: "pre-wrap" }}>
                <LinesEllipsis
                  text={doc.data.title}
                  maxLine="3"
                  ellipsis="..."
                  trimRight
                  basedOn="letters"
                />
              </h6>
            </div>
            <div className="mt-3">
              <Link
                className="doc-open"
                onClick={stopPlaying}
                to={{
                  pathname: `/doc/${doc.document_id}`,
                  state: { modal: true }
                }}
              >
                {t("open")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
