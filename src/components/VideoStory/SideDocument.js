import React, { memo } from "react";
import { Link } from "react-router-dom";
import { DraggableCore } from "react-draggable";

export default memo(function SideDocument({ onDrag, width, doc, stopPlaying }) {
  let year = null;
  if (doc) {
    year = new Date(doc.data.start_date).getFullYear();
    year = isNaN(year) ? null : year;
  }
  return (
    <div className="side-document" style={{ width }}>
      {doc && (
        <div className="display-doc text-white px-2">
          <div className="title py-4">
            <div className="truncate-parent">
              <p className="text-truncate mb-0 text-white-50">{year}</p>
              <h6 className="text-truncate">{doc.title}</h6>
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
                open
              </Link>
            </div>
          </div>
          <div
            className="doc-image"
            style={{
              backgroundImage: `url(${
                doc.data.resolutions ? doc.data.resolutions.medium.url : ""
              })`
            }}
          />
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
