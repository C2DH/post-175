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
  countModules,
  t
}) {
  return (
    <div className={classNames("story-card", { disabled: !countModules })}>
      <Link to={`/stories/${slug}`}>
        <div className="count">{count}</div>
        <div className="image" style={{ backgroundImage: `url('${image}')` }} />
        <h4 className="title my-3">{title}</h4>
        <p className="description">
          {description ? description : t("soon_online")}
        </p>
      </Link>
    </div>
  );
});
