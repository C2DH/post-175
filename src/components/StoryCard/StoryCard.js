import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { connect } from "react-redux";
import { getSelectedLang } from "../../state/selectors";
import "./StoryCard.scss";

class StoryCard extends PureComponent {
  render() {
    const {
      count,
      image,
      title,
      description,
      slug,
      countModules,
      t,
      selectedLang,
    } = this.props;
    return (
      <div className={classNames("story-card", { disabled: !countModules })}>
        <Link
          to={{
            pathname: `/stories/${slug}`,
            search: `?lang=${selectedLang.param}`,
          }}
        >
          <div className="count">{count}</div>
          <div
            className="image"
            style={{ backgroundImage: `url('${image}')` }}
          />
          <h4 className="title my-3">{title}</h4>
          <p className="description">
            {description ? description : t("soon_online")}
          </p>
        </Link>
      </div>
    );
  }
}

export default connect((state) => ({
  selectedLang: getSelectedLang(state),
}))(StoryCard);
