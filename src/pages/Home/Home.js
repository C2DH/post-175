import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { localize } from "../../localize";
import { Link } from "react-router-dom";
import HomePics from "../../components/HomePics";
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
import "./Home.css";

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
    return (
      <div className="h-100 d-flex flex-column Home">
        <div className="flex-grow-0 flex-shrink-0">
          <div className="container">
            <div className="row">
              <div className="col">
                <h1 className="text-white">
                  {story ? story.data.subtitle : ""}
                </h1>
              </div>
              <div className="col-3 text-white">
                <p>{story ? story.data.abstract : ""}</p>
                <p>
                  <Link to={url("/about")} className="text-white">
                    {t("home_readmore")}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-shrink-1 flex-grow-1 position-relative">
          {docs && <HomePics docs={docs} />}
        </div>
        <div className="flex-grow-0 flex-shrink-0 bg-white">
          <div className="container">
            <div className="row">
              <div className="col-3 border-right">
                <Link to={url("/timeline")}>
                  <span className="d-flex d-inline-flex justify-content-between align-items-center">
                    <i className="material-icons">arrow_forward</i>
                    <span>{t("menu_timeline")}</span>
                  </span>
                </Link>
              </div>
              <div className="col-3 border-right">
                <Link to={url("/collection")}>
                  <span className="d-flex d-inline-flex justify-content-between align-items-center">
                    <i className="material-icons">arrow_forward</i>
                    <span>{t("menu_collection")}</span>
                  </span>
                </Link>
              </div>
              <div className="col-3 border-right">
                <Link to={url("/map")}>
                  <span className="d-flex d-inline-flex justify-content-between align-items-center">
                    <i className="material-icons">arrow_forward</i>
                    <span>{t("menu_map")}</span>
                  </span>
                </Link>
              </div>
              <div className="col-3">
                <Link to={url("/themes")}>
                  <span className="d-flex d-inline-flex justify-content-between align-items-center">
                    <i className="material-icons">arrow_forward</i>
                    <span>{t("menu_themes")}</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    // return (
    //   <div className="h-100 d-flex flex-column bg-black">
    //     <div className="row no-gutters flex-1 w-100 ">
    //       {docs && <HomePics docs={docs} />}
    //     </div>
    //     <div className="home-info-container row no-gutters flex-1 w-100 d-flex mb-4 p-3 bg-black flex-wrap flex-md-nowrap">
    //       <div className="d-flex h-100 home-flex-1 flex-column">
    //         <div>
    //           <h1>
    //             175{" "}
    //             <span style={{ fontWeight: 300 }}>{t("home_joerpost")}</span>
    //           </h1>
    //           <p className="home-subtitle">
    //             {story ? story.data.subtitle : ""}
    //           </p>
    //         </div>
    //         <div className="mt-auto mb-5">
    //           {langs.map(lang => (
    //             <h5
    //               onClick={() => this.changeLang(lang.param)}
    //               key={lang.code}
    //               className={classNames(
    //                 "text-light font-weight-light p-0 m-0 pointer",
    //                 {
    //                   "text-underlined": lang.code === selectedLang.code
    //                 }
    //               )}
    //             >
    //               {lang.label}
    //             </h5>
    //           ))}
    //         </div>
    //       </div>
    //       <div className="d-flex home-h-100 home-flex-1 flex-column">
    //         <p className="lead-24">{story ? story.data.abstract : ""}</p>
    //         <Link to={url("/about")} className="text-white">
    //           {t("home_readmore")}
    //         </Link>
    //       </div>
    //       <div
    //         className="d-flex h-100 justify-content-end"
    //         style={{ flex: 1.5 }}
    //       >
    //         <div className="d-flex flex-column">
    //           <div className="home-button p-3 border mb-1">
    //             <Link to={url("/timeline")}>
    //               <span className="text-light d-flex d-inline-flex justify-content-between align-items-center w-100 lead-24">
    //                 <span className="ml-3">{t("home_button1")}</span>
    //                 <i className="material-icons mr-3 ml-2">arrow_forward</i>
    //               </span>
    //             </Link>
    //           </div>
    //           <div className="home-button p-3 border mt-1">
    //             <Link to={url("/map")}>
    //               <span className="text-light d-flex d-inline-flex justify-content-between align-items-center w-100 lead-24">
    //                 <span className="ml-3">{t("home_button2")}</span>
    //                 <i className="material-icons mr-3 ml-2">arrow_forward</i>
    //               </span>
    //             </Link>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     <div
    //       className="row no-gutters w-100 fixed-bottom d-flex align-items-center bg-opaque-black"
    //       style={{ height: 60 }}
    //     >
    //       <p className="m-0 pl-3 font-14">
    //         {t("home_footer")} -{" "}
    //         <a
    //           className="home-link"
    //           href="https://www.c2dh.uni.lu"
    //           target="_black"
    //         >
    //           C<sup>2</sup>DH
    //         </a>
    //       </p>
    //     </div>
    //   </div>
    // );
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