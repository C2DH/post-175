import React, { PureComponent } from "react";
import classNames from "classnames";
import { localize } from "../../localize";
import "./IeWarning.scss";

class IeWarning extends PureComponent {
  render() {
    const { t } = this.props;
    return (
      <div className="IeWarning">
        <div className="message">
          <p className="text-center">
            <i className="material-icons">warning</i>
          </p>
          <div>{t("ie").paragraphs &&
            t("ie").paragraphs.map((p) => {
              return (
                <p>{p}</p>
              )
            })
          }</div>
        </div>
      </div>
    );
  }
}

export default localize()(IeWarning);
