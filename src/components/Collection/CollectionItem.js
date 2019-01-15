import React, { PureComponent } from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import MagikDotDotDot from "../MagikDotDotDot";
import CollectionImage from "./CollectionImage";
import "./Collection.scss";
import { TYPE_ICON } from "../../consts";

export default class CollectionItem extends PureComponent {
  render() {
    const { doc } = this.props;
    return (
      <Link
        to={{ pathname: `/doc/${doc.id}`, state: { modal: true } }}
        className="d-flex w-100"
      >
        <div className="collection-item d-flex flex-column justify-content-between w-100 text-white">
          <div className="item-caption flex-shrink-0 flex-grow-0">
            <div className="d-flex item-info">
              <div className="item-year">{doc.data.year}</div>
              <div className="item-icon ml-auto">
                <i className="material-icons">{TYPE_ICON[doc.type]}</i>
              </div>
            </div>
            <div className="item-label">
              {/* Fuck off multiline ellipsis use dot dot dot */}
              <MagikDotDotDot clamp={2}>{doc.data.title}</MagikDotDotDot>
            </div>
          </div>
          <div
            className={classNames("item-image-box flex-grow-1", {
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
