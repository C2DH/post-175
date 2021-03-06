import React, { PureComponent, Fragment } from "react";
import { connect } from "react-redux";
import { Route, Switch, withRouter } from "react-router-dom";
import qs from "query-string";
import { find, get } from "lodash";
import Media from "react-media";
import BrowserDetection from "react-browser-detection";
import { getLangs } from "../../state/selectors";
import { setLang } from "../../state/actions";
import Home from "../../pages/Home";
import Map from "../../pages/Map";
import TimelinePage from "../../pages/Timeline";
import TimelineMobilePage from "../../pages/TimelineMobile";
import About from "../../pages/About";
import TermsOfUse from "../../pages/TermsOfUse";
import Collection from "../../pages/Collection";
import DocumentDetail from "../../pages/DocumentDetail";
import DocumentDetailModal from "../../pages/DocumentDetailModal";
import StoriesRoot from "../../pages/StoriesRoot";
import CookieBanner from "../CookieBanner";
import IeWarning from "../IeWarning";

const browserHandler = {
  ie: () => <IeWarning></IeWarning>
};

class LangRoot extends PureComponent {
  componentWillMount() {
    const langFromUrl = this.getLangFromSearch(this.props.location.search);
    if (langFromUrl) {
      this.props.setLang(langFromUrl.code);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.search !== nextProps.location.search) {
      const langFromUrl = this.getLangFromSearch(this.props.location.search);
      const nextLangFromUrl = this.getLangFromSearch(nextProps.location.search);
      // Next lang is valid and different form previous
      if (
        nextLangFromUrl &&
        (!langFromUrl || langFromUrl.code !== nextLangFromUrl.code)
      ) {
        this.props.setLang(nextLangFromUrl.code);
      }
    }
  }

  componentWillUpdate(nextProps) {
    const { location } = this.props;
    if (
      nextProps.history.action !== "POP" &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = this.props.location;
    }
  }

  previousLocation = this.props.location;

  getLangFromSearch = search => {
    const langParam = get(qs.parse(search), "lang", "fr");
    return find(this.props.langs, { param: langParam });
  };

  render() {
    const { lang, location, history } = this.props;

    const isModal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location
    );

    return (
      <Fragment>
        <Media query="(max-width: 767.98px)">
          {matches =>
            matches ? (
              <Fragment>
                <Switch location={isModal ? this.previousLocation : location}>
                  <Route path="/" exact component={Home} />
                  <Route path="/map" exact component={Map} />
                  <Route
                    path="/timeline"
                    exact
                    component={TimelineMobilePage}
                  />
                  <Route path="/about" exact component={About} />
                  <Route path="/terms-of-use" exact component={TermsOfUse} />
                  <Route path="/collection" exact component={Collection} />
                  <Route path="/stories" component={StoriesRoot} />
                  <Route path="/doc/:id" exact component={DocumentDetail} />
                </Switch>
                {isModal ? (
                  <Route
                    path="/doc/:id"
                    exact
                    component={DocumentDetailModal}
                  />
                ) : null}
              </Fragment>
            ) : (
              <Fragment>
                <Switch location={isModal ? this.previousLocation : location}>
                  <Route path="/" exact component={Home} />
                  <Route path="/map" exact component={Map} />
                  <Route path="/timeline" exact component={TimelinePage} />
                  <Route path="/about" exact component={About} />
                  <Route path="/terms-of-use" exact component={TermsOfUse} />
                  <Route path="/collection" exact component={Collection} />
                  <Route path="/stories" component={StoriesRoot} />
                  <Route path="/doc/:id" exact component={DocumentDetail} />
                </Switch>
                {isModal ? (
                  <Route
                    path="/doc/:id"
                    exact
                    component={DocumentDetailModal}
                  />
                ) : null}
              </Fragment>
            )
          }
        </Media>
        <BrowserDetection>{browserHandler}</BrowserDetection>
        <CookieBanner history={history} />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  langs: getLangs(state)
});
export default withRouter(
  connect(
    mapStateToProps,
    {
      setLang
    }
  )(LangRoot)
);
