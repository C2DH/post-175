import React, { PureComponent, Fragment } from "react";
import { connect } from "react-redux";
import ReactMarkdown from "react-markdown";
import ShortCodes from "remark-shortcodes";
import { localize } from "../../localize";
import { loadStory, unloadStory } from "../../state/actions";
import { getStory } from "../../state/selectors";
import SideMenu from "../../components/SideMenu";
import { GAOptInOut } from "../../components/CookieBanner";
import "./TermsOfUse.scss";


const GAOptInOutRenderer = ({ identifier }) => (
	<Fragment>
		{identifier === 'GAOptInOut' && <GAOptInOut />}
	</Fragment>
)

class TermsOfUse extends PureComponent {
  componentDidMount() {
    this.props.loadStory("terms-of-use");
  }

  componentWillUnmount() {
    this.props.unloadStory();
  }

  render() {
    const { story, t } = this.props;
    return (
      <div className="h-100 TermsOfUse bg-white">
        <SideMenu />
        <div className="container">
          <div className="row">
            <div className="col">
              <h1 className="my-3 my-md-4 text-uppercase">
                {story ? story.data.title : ""}
              </h1>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-8">
              <div className="page-content">
                {story && (
                  <ReactMarkdown
                    linkTarget	= "_blank"
                    plugins			= {[ShortCodes]}
                    source			= {story.data.abstract}
                    renderers		= {{shortcode: GAOptInOutRenderer}}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  story: getStory(state),
});

export default localize()(
  connect(mapStateToProps, {
    loadStory,
    unloadStory,
  })(TermsOfUse)
);
