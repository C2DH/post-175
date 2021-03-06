import React, { Component } from "react";
import { connect } from "react-redux";
import padStart from "lodash/padStart";
import get from "lodash/get";
import { loadChapters } from "../../state/actions";
import { getChapters } from "../../state/selectors";
import StoryCard from "../../components/StoryCard";
import SideMenu from "../../components/SideMenu";
import Spinner from "../../components/Spinner";
import { localize } from "../../localize";
import "./Stories.scss";

class Stories extends Component {
  componentDidMount() {
    this.props.loadChapters();
  }

  render() {
    const { chapters, t } = this.props;
    return (
      <div className="h-100 Stories">
        {chapters === null && <Spinner firstLoading screen="stories" />}
        <SideMenu />
        <div className="container-fluid h-100 d-flex flex-column">
          <div className="row row-top-bar">
            <div className="col">
              <div className="top-bar d-flex align-items-center">
                <h2 className="text-white m-0">{t("menu_themes")}</h2>
              </div>
            </div>
          </div>
          <div className="row h-100 " style={{ overflow: "auto" }}>
            <div className="d-flex flex-column flex-md-row h-100">
              {chapters &&
                chapters.map((chapter, i) => (
                  <StoryCard
                    count={padStart(i + 1, 2, 0)}
                    image={get(
                      chapter,
                      "covers[0].data.resolutions.medium.url"
                    )}
                    countModules={chapter.data.count_modules}
                    key={chapter.id}
                    slug={chapter.slug}
                    title={chapter.data.title}
                    description={chapter.data.abstract}
                    t={t}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    chapters: getChapters(state),
  }),
  {
    loadChapters,
  }
)(localize()(Stories));
