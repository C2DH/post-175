import React, { PureComponent } from "react";
import classNames from "classnames";
import { withRouter, NavLink } from "react-router-dom";
import { TransitionMotion, spring } from "react-motion";
import { connect } from "react-redux";
import {
  getLangs,
  getSelectedLang,
  getMakeLangUrl,
} from "../../state/selectors";
import "./HomeMenu.scss";

class HomeMenu extends PureComponent {
  changeLang = (langParam) => {
    const { url, location } = this.props;
    const currentUrl = location.pathname + location.search;
    this.props.history.push(url(currentUrl, langParam));
  };

  render() {
    const { langs, selectedLang, className } = this.props;
    return (
      <div className={`HomeMenu d-flex flex-column ${className}`}>
        <div className="info d-none d-md-flex">
          <NavLink
            to={{ pathname: "/about", search: `?lang=${selectedLang.param}` }}
            className="d-flex"
          >
            <i className="material-icons text-dark">info</i>
          </NavLink>
        </div>
        {langs.map((lang) => (
          <div
            onClick={() => this.changeLang(lang.param)}
            key={lang.code}
            className={classNames("lang", {
              "current-lang": lang.code === selectedLang.code,
            })}
          >
            {lang.param}
          </div>
        ))}
      </div>
    );
  }
}

export default withRouter(
  connect((state) => ({
    url: getMakeLangUrl(state),
    langs: getLangs(state),
    selectedLang: getSelectedLang(state),
  }))(HomeMenu)
);
