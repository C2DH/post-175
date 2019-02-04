import React, { memo, Fragment } from "react";

export default memo(function Speaker({ doc }) {
  return (
    <div className="speaker">
      {doc && (
        <Fragment>
          <p className="text-white-50 mb-2">speaker</p>
          <h1>{doc.title}</h1>
        </Fragment>
      )}
    </div>
  );
});
