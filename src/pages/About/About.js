import React, { PureComponent } from "react";
import { connect } from "react-redux";
import ReactMarkdown from "react-markdown";
import { localize } from "../../localize";
import { loadStory, unloadStory } from "../../state/actions";
import { getStory } from "../../state/selectors";
import SideMenu from "../../components/SideMenu";
import "./About.scss";

class About extends PureComponent {
  componentDidMount() {
    this.props.loadStory("about");
  }

  componentWillUnmount() {
    this.props.unloadStory();
  }

  render() {
    const { story, t } = this.props;
    return (
      <div className="h-100 About bg-white">
        <SideMenu />
        <div className="container">
          <div className="row">
            <div className="col">
              <h1 className="my-4 text-uppercase">
                {story ? story.data.title : ""}
              </h1>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <div className="page-content">
                {story && <ReactMarkdown source={story.data.abstract} />}
              </div>
            </div>
            <div className="col-6">
              <div className="page-content-org">
                <h6>{t("partners")}</h6>
                <div className="d-flex flex-wrap align-items-center">
                  <div className="col-4">
                    <a href="https://uni.lu" target="_blank">
                      <img className="img-fluid" src="/img/unilu.jpg" />
                    </a>
                  </div>
                  <div className="col-4">
                    <a href="https://www.c2dh.uni.lu/" target="_blank">
                      <img className="img-fluid" src="/img/c2dh.jpg" />
                    </a>
                  </div>
                  <div className="col-4">
                    <a href="https://www.post.lu/" target="_blank">
                      <img className="img-fluid" src="/img/post.png" />
                    </a>
                  </div>
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
  story: getStory(state)
});

export default localize()(
  connect(
    mapStateToProps,
    {
      loadStory,
      unloadStory
    }
  )(About)
);
