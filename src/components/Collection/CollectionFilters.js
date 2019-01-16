import React, { PureComponent, Fragment } from "react";
import { connect } from "react-redux";
import { searchSuggestions, clearSuggestions } from "../../state/actions";
import debounce from "lodash/debounce";
import { localize } from "../../localize";
import classNames from "classnames";
import { COLLECTION_DATE_TYPES } from "../../consts";
import Search from "./Search";
import CollectionTimeBrush from "./CollectionTimeBrush";
import "./Collection.scss";

class CollectionFilters extends PureComponent {
  state = {
    prevLocationKey: this.props.locationKey,
    searchText: this.props.search,
    open: false
  };

  static getDerivedStateFromProps(props, state) {
    if (state.prevLocationKey !== props.locationKey) {
      if (state.searchText !== props.search) {
        return {
          searchText: props.search,
          prevLocationKey: props.locationKey
        };
      }
      return {
        prevLocationKey: props.locationKey
      };
    }
    return null;
  }

  toggleFiltersOpen = () =>
    this.setState(({ open }) => ({
      open: !open
    }));

  handleOnSearchChange = (e, { newValue }) => {
    this.setState(
      {
        searchText: newValue
      },
      () => {
        this.debouncedOnSearchChange(newValue);
      }
    );
  };

  onSuggestionSelected = (e, { suggestion }) => {
    this.setState(
      {
        searchText: suggestion
      },
      () => {
        this.props.onSearchChange(suggestion);
      }
    );
  };

  debouncedOnSearchChange = debounce(this.props.onSearchChange, 150);

  debouncedSearchSuggestions = debounce(this.props.searchSuggestions, 150);

  render() {
    const {
      categories,
      onToggleCategory,
      suggestions,
      clearSuggestions,
      t,
      locationKey,
      startYear,
      endYear,
      onYearsChange,
      facets,
      allFacets,
      count,
      allCount,
      includeUncertain,
      toggleUncertain
    } = this.props;
    const { open } = this.state;

    return (
      <Fragment>
        <div className="container-fluid CollectionFilters">
          <div className="row top-bar border-bottom align-items-center">
            <div className="col-auto mr-auto">
              <div className="text-white">
                <h2 className="m-0 d-inline-block">Archive</h2>
                <small className="ml-2">
                  {count} / {allCount}
                </small>
                <small className="ml-2">items shown</small>
              </div>
            </div>
            <div className="col-auto">
              <div className="d-flex align-items-center">
                <Search
                  placeholder="Search"
                  onSuggestionSelected={this.onSuggestionSelected}
                  searchSuggestions={this.debouncedSearchSuggestions}
                  clearSuggestions={clearSuggestions}
                  suggestions={suggestions}
                  value={this.state.searchText}
                  onChange={this.handleOnSearchChange}
                />
                <button className="ml-2 btn d-flex align-items-center justify-content-center bg-transparent text-white">
                  <i className="material-icons">search</i>
                </button>
                <button
                  className="ml-2 btn d-flex align-items-center justify-content-center bg-transparent text-white"
                  onClick={this.toggleFiltersOpen}
                >
                  <i className="material-icons">
                    {open ? "close" : "filter_list"}
                  </i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className={classNames("collection-filters CollectionFilters", {
            open: open
          })}
        >
          <div className="container-fluid">
            <div className="row">
              <div className="col-4">
                <h6 className="filter-sub-title mt-3">filter by type</h6>
                <div className="categories-radios d-flex flex-wrap my-3">
                  {COLLECTION_DATE_TYPES.map(name => (
                    <div className="custom-control custom-checkbox" key={name}>
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        checked={
                          categories.length
                            ? categories.indexOf(name) !== -1
                            : true
                        }
                        id={name}
                        onChange={() => onToggleCategory(name)}
                        name={name}
                      />
                      <label className="custom-control-label" htmlFor={name}>
                        {t(name)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-8 d-flex flex-column">
                <h6 className="filter-sub-title mt-3">filter by year</h6>
                {allFacets && (
                  <CollectionTimeBrush
                    includeUncertain={includeUncertain}
                    toggleUncertain={toggleUncertain}
                    locationKey={locationKey}
                    startYear={startYear}
                    endYear={endYear}
                    onYearsChange={onYearsChange}
                    facets={facets}
                    allFacets={allFacets}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default connect(
  state => ({
    suggestions: state.searchSuggestion.results
  }),
  {
    searchSuggestions,
    clearSuggestions
  }
)(localize()(CollectionFilters));
