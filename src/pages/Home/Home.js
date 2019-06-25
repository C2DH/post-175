import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { localize } from "../../localize";
import { Link } from "react-router-dom";
import HomePics from "../../components/HomePics";
import HomeMenu from "../../components/HomeMenu";
import classNames from "classnames";
import {
  loadHomeDocs,
  unloadHomeDocs,
  loadStory,
  unloadStory
} from "../../state/actions";
import {
  getHomeDocs,
  getMakeLangUrl,
  getLangs,
  getSelectedLang,
  getStory
} from "../../state/selectors";
import "./Home.scss";

class Home extends PureComponent {
  componentDidMount() {
    this.props.loadHomeDocs();
    this.props.loadStory("home");
  }

  componentWillUnmount() {
    this.props.unloadHomeDocs();
    this.props.unloadStory();
  }

  changeLang = langParam => {
    const { url, location } = this.props;
    const currentUrl = location.pathname + location.search;
    this.props.history.push(url(currentUrl, langParam));
  };

  render() {
    const { url, docs, langs, selectedLang, story, t } = this.props;
    const subititleForced =
      story && story.data.subtitle ? story.data.subtitle.split(" ") : [];

    return (
      <div className="h-100 d-flex flex-column Home position-relative">
        <div className="background-container px-5 px-xl-0">
          <div className="container h-100">
            <div className="row h-100 cols-grid">
              <div className="col-3 border-right border-left border-light" />
              <div className="col-3 border-right" />
              <div className="col-3 border-right" />
              <div className="col-3 border-right" />
            </div>
          </div>
        </div>
        <div className="flex-grow-0 flex-shrink-0 px-5 px-xl-0">
          <div className="container">
            <div className="row">
              <div className="col">
                <h1 className="text-white text-uppercase mt-3">
                  {subititleForced &&
                    subititleForced.map((d, i) => {
                      if (i === 0) {
                        return (
                          <span key={d}>
                            {d} <br />
                          </span>
                        );
                      } else {
                        return <span key={d}>{d} </span>;
                      }
                    })}
                </h1>
              </div>
              <div className="col-3 text-white">
                <p className="mt-3 text-white-50 abstract">
                  {story ? story.data.abstract : ""}
                </p>
                <p>
                  <Link
                    to={url("/about")}
                    className="text-white read-more text-uppercase"
                  >
                    {t("home_readmore")}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="my-3 flex-shrink-1 flex-grow-1 position-relative">
          {docs && <HomePics docs={docs} />}
        </div>
        <div className="flex-grow-0 flex-shrink-0 bg-white position-relative px-5 px-xl-0">
          <HomeMenu />
          <div className="container">
            <div className="row">
              <div className="col-3 border-right border-left p-0">
                <div className="section-container">
                  <Link to={url("/timeline")}>
                    <span className="moving-container d-flex d-inline-flex justify-content-between align-items-center">
                      <i className="material-icons text-dark moving-icon">
                        arrow_forward
                      </i>
                      <span className="section-text text-dark">
                        {t("menu_timeline")}
                      </span>
                    </span>
                  </Link>
                </div>
              </div>
              <div className="col-3 border-right p-0">
                <div className="section-container">
                  <Link to={url("/collection")}>
                    <span className="moving-container d-flex d-inline-flex justify-content-between align-items-center">
                      <i className="material-icons text-dark moving-icon">
                        arrow_forward
                      </i>
                      <span className="section-text text-dark">
                        {t("menu_collection")}
                      </span>
                    </span>
                  </Link>
                </div>
              </div>
              <div className="col-3 border-right p-0">
                <div className="section-container">
                  <Link to={url("/map")}>
                    <span className="moving-container d-flex d-inline-flex justify-content-between align-items-center">
                      <i className="material-icons text-dark moving-icon">
                        arrow_forward
                      </i>
                      <span className="section-text text-dark">
                        {t("menu_map")}
                      </span>
                    </span>
                  </Link>
                </div>
              </div>
              <div className="col-3 border-right p-0">
                <div className="section-container">
                  <Link to={url("/stories")}>
                    <span className="moving-container d-flex d-inline-flex justify-content-between align-items-center">
                      <i className="material-icons text-dark moving-icon">
                        arrow_forward
                      </i>
                      <span className="section-text text-dark">
                        {t("menu_themes")}
                      </span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  story: getStory(state),
  url: getMakeLangUrl(state),
  docs: getHomeDocs(state),
  langs: getLangs(state),
  selectedLang: getSelectedLang(state)
});
export default localize()(
  connect(
    mapStateToProps,
    {
      loadHomeDocs,
      unloadHomeDocs,
      loadStory,
      unloadStory
    }
  )(Home)
);
