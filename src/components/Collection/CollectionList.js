import React, { PureComponent } from "react";
import classNames from "classnames";
import CollectionItem from "./CollectionItem";
import Media from "react-media";
import { List, WindowScroller, AutoSizer } from "react-virtualized";
import "./Collection.scss";

export default class CollectionList extends PureComponent {
  renderRow = ({ key, index, style }) => {
    const { docs } = this.props;
    const docRow = docs[index];

    return (
      <div className="row no-gutters collection-row" key={key} style={style}>
        {docRow.map(doc => (
          <div
            key={doc.id}
            className={classNames(`collection-col d-flex`, {
              "col-6 col-md-2 order-0":
                docRow.length === 6 || (docRow.length === 5 && !doc.large),
              "col-12 col-md-4 order-1 order-md-0":
                docRow.length === 5 && doc.large,
              "col-placeholder": doc.placeholder
            })}
          >
            {doc.placeholder ? <div /> : <CollectionItem doc={doc} />}
          </div>
        ))}
      </div>
    );
  };

  render() {
    const { docs } = this.props;
    return (
      <div className="collection-list">
        <div className="collection-list-wrapper container-fluid">
          <AutoSizer>
            {({ width, height }) => (
              <Media query="(max-width: 767.98px)">
                {matches =>
                  matches ? (
                    <List
                      height={height}
                      width={width}
                      rowCount={docs.length}
                      rowRenderer={this.renderRow}
                      rowHeight={810}
                    />
                  ) : (
                    <List
                      height={height}
                      width={width}
                      rowCount={docs.length}
                      rowRenderer={this.renderRow}
                      rowHeight={430}
                    />
                  )
                }
              </Media>
            )}
          </AutoSizer>
        </div>
      </div>
    );
  }
}
