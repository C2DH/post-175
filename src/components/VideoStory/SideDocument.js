import React, { memo } from "react";
import { Link } from "react-router-dom";
import { DraggableCore } from "react-draggable";
import DocDate from "../DocDate";
import SideDocumentMedia from "./SideDocumentMedia";

export default memo(function SideDocument({
  onDrag,
  width,
  doc,
  stopPlaying,
  t
}) {
  return (
    <div className="side-document" style={{ width }}>
      {doc && (
        <div className="display-doc text-white px-2">
          <div className="title py-4">
            <div className="truncate-parent">
              <p className="text-truncate mb-0 text-white-50">
                {" "}
                <DocDate
                  startDate={doc.data.start_date}
                  endDate={doc.data.end_date}
                  year={doc.data.year}
                  date={doc.data.date}
                />
              </p>
              <h6 className="text-truncate">{doc.data.title}</h6>
            </div>
            <div className="mx-4">
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
          <SideDocumentMedia doc={doc} />
        </div>
      )}

      <DraggableCore onDrag={onDrag}>
        <div className="handle-circle-container">
          <svg width={50} height={50}>
            <circle cx={25} cy={25} r={25} fill={"grey"} />
            <circle cx={25} cy={25} r={15} fill="#f8c91c" />
          </svg>
        </div>
      </DraggableCore>
    </div>
  );
});
