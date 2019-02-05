import React, { memo } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import "./StoryCard.scss";

export default memo(function StoryCard({
  count,
  image,
  title,
  description,
  slug,
  countModules
}) {
  return (
    <Link
      to={`/stories/${slug}`}
      className={classNames("story-card", { disabled: !countModules })}
    >
      <div className="story-card-content">
        <div className="count">{count}</div>
        <div className="image" style={{ backgroundImage: `url('${image}')` }} />
        <h4 className="title my-3">{title}</h4>
        <p className="description">
          {description ? description : "bientôt en ligne"}
        </p>
      </div>
    </Link>
  );
});
