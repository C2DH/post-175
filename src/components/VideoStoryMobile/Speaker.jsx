import React, { memo, Fragment } from "react";

export default memo(function Speaker({ doc, t }) {
  return (
    <div className="speaker">
      {doc && (
        <Fragment>
          <p className="text-white-50">{t("speaker")}</p>
          <h6 className="pl-2 text-white">{doc.title}</h6>
        </Fragment>
      )}
    </div>
  );
});
