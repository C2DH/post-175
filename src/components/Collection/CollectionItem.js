import React, { PureComponent } from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import MagikDotDotDot from "../MagikDotDotDot";
import CollectionImage from "./CollectionImage";
import "./Collection.css";

export default class CollectionItem extends PureComponent {
  render() {
    const { doc } = this.props;
    return (
      <Link to={{ pathname: `/doc/${doc.id}`, state: { modal: true } }}>
        <div className="collection-item d-flex flex-column w-100 h-100 text-white">
          <div className="item-caption flex-shrink-0 flex-grow-0">
            <div className="item-year">{doc.data.year}</div>
            <div className="item-label">
              {/* Fuck off multiline ellipsis use dot dot dot */}
              <MagikDotDotDot clamp={2}>{doc.data.title}</MagikDotDotDot>
            </div>
          </div>
          <div
            className={classNames("item-image-box flex-grow-1 flex-shrink-1", {
              "item-image-large": doc.large
            })}
          >
            <CollectionImage doc={doc} />
          </div>
        </div>
      </Link>
    );
  }
}
