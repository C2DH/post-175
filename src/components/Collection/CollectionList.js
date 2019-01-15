import React, { PureComponent } from "react";
import classNames from "classnames";
import CollectionItem from "./CollectionItem";
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
              col: docRow.length === 6,
              "col-2": docRow.length === 5 && !doc.large,
              "col-4": docRow.length === 5 && doc.large,
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
              <List
                height={height}
                width={width}
                rowCount={docs.length}
                rowRenderer={this.renderRow}
                rowHeight={430}
              />
            )}
          </AutoSizer>
        </div>
      </div>
    );
  }
}
