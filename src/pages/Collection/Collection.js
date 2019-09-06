import React, { PureComponent } from "react";
import { connect } from "react-redux";
import qs from "query-string";
import get from "lodash/get";
import SideMenu from "../../components/SideMenu";
import CollectionFilters from "../../components/Collection/CollectionFilters";
import CollectionList from "../../components/Collection/CollectionList";
import Spinner from "../../components/Spinner";
import { COLLECTION_DATE_TYPES } from "../../consts";
import {
  loadCollectionDocuments,
  unloadCollectionDocuments,
  loadCollectionFacets,
  unloadCollectionFacets
} from "../../state/actions";
import {
  isLoadingCollectionDocs,
  getCollectionDocuments,
  getCollectionsFacets,
  getCollectionsAllFacets,
  getCollectionCount,
  getCollectionAllCount,
  getCollectionsDataTypeFacets,
  getCollectionsDataTypeAllFacets
} from "../../state/selectors";
import "./CollectionPage.scss";

const parseQsAsList = str => str.split(",").filter(Boolean);

class Collection extends PureComponent {
  componentDidMount() {
    const queryParams = qs.parse(this.props.location.search);
    this.loadDocs(this.parseQueryParams(queryParams));
    this.props.loadCollectionFacets({
      filters: {
        data__type__in: COLLECTION_DATE_TYPES
      }
    });
  }

  componentDidUpdate(prevProps) {
    const prevQueryParams = qs.parse(prevProps.location.search);
    const queryParams = qs.parse(this.props.location.search);
    if (
      prevQueryParams.search !== queryParams.search ||
      prevQueryParams.categories !== queryParams.categories ||
      prevQueryParams.overlaps !== queryParams.overlaps ||
      prevQueryParams.uncertain !== queryParams.uncertain
    ) {
      this.loadDocs(this.parseQueryParams(queryParams));
    }
  }

  componentWillUnmount() {
    this.props.unloadCollectionDocuments();
    this.props.unloadCollectionFacets();
  }

  loadDocs = ({ categories, search, overlaps, includeUncertain }) => {
    let overlapsQuery;
    if (overlaps && overlaps[0] && overlaps[1]) {
      overlapsQuery = `${overlaps[0].getFullYear()}-01-01,${overlaps[1].getFullYear()}-12-31`;
    }
    let exclude = {};
    if (!includeUncertain) {
      exclude = {
        data__year__iexact: "uncertain"
      };
    }
    this.props.loadCollectionDocuments({
      overlaps: overlapsQuery,
      exclude,
      filters: {
        data__type__in:
          categories.length > 0 ? categories : COLLECTION_DATE_TYPES
      },
      q: search
    });
  };

  parseQueryParams = queryParams => {
    const search = get(queryParams, "search", "");
    const categories = parseQsAsList(get(queryParams, "categories", ""));
    const includeUncertain = +get(queryParams, "uncertain", "1") ? true : false;
    let overlaps = get(queryParams, "overlaps", "")
      .split(",")
      .filter(Boolean);
    overlaps = [
      isNaN(overlaps[0]) ? null : new Date(`${overlaps[0]}-01-01`),
      isNaN(overlaps[1]) ? null : new Date(`${overlaps[1]}-12-31`)
    ];

    return { search, categories, overlaps, includeUncertain };
  };

  handleOnOverlapsChange = (startYear, endYear) => {
    const { location } = this.props;
    const queryParams = qs.parse(location.search);

    this.props.history.push(
      `${location.pathname}?${qs.stringify(
        {
          ...queryParams,
          overlaps: `${startYear.getFullYear()},${endYear.getFullYear()}`
        },
        {
          encode: false
        }
      )}`
    );
  };

  handleOnSearchChange = search => {
    const { location } = this.props;
    const queryParams = qs.parse(location.search);

    this.props.history.push(
      `${location.pathname}?${qs.stringify(
        {
          ...queryParams,
          search
        },
        {
          encode: false
        }
      )}`
    );
  };

  handleToggleCategory = category => {
    const { location } = this.props;
    const queryParams = qs.parse(location.search);
    const oldCategories = parseQsAsList(get(queryParams, "categories", ""));
    const categories =
      oldCategories.indexOf(category) === -1
        ? oldCategories.concat(category)
        : oldCategories.filter(cat => cat !== category);

    this.props.history.push(
      `${location.pathname}?${qs.stringify(
        {
          ...queryParams,
          categories: categories.join(",")
        },
        {
          encode: false
        }
      )}`
    );
  };

  handleToggleUncertain = () => {
    const { location } = this.props;
    const queryParams = qs.parse(location.search);
    const uncertain = +get(queryParams, "uncertain", "1") ? "0" : "1";

    this.props.history.push(
      `${location.pathname}?${qs.stringify(
        {
          ...queryParams,
          uncertain
        },
        {
          encode: false
        }
      )}`
    );
  };

  render() {
    const {
      docs,
      loading,
      facets,
      allFacets,
      location,
      count,
      allCount,
      dataTypeFacets,
      dataTypeAllFacets
    } = this.props;
    const queryParams = qs.parse(location.search);
    const {
      search,
      categories,
      overlaps,
      includeUncertain
    } = this.parseQueryParams(queryParams);

    return (
      <div className="h-100 CollectionPage">
        <SideMenu />
        <CollectionFilters
          locationKey={location.key}
          search={search}
          onSearchChange={this.handleOnSearchChange}
          categories={categories}
          onToggleCategory={this.handleToggleCategory}
          count={count}
          allCount={allCount}
          includeUncertain={includeUncertain}
          toggleUncertain={this.handleToggleUncertain}
          startYear={overlaps[0]}
          endYear={overlaps[1]}
          onYearsChange={this.handleOnOverlapsChange}
          facets={facets}
          allFacets={allFacets}
          dataTypeFacets={dataTypeFacets}
          dataTypeAllFacets={dataTypeAllFacets}
        />
        {docs && <CollectionList docs={docs} />}
        {(docs === null || loading) && (
          <Spinner screen={"collection"} firstLoading={docs === null} />
        )}
      </div>
    );
  }
}

export default connect(
  state => ({
    loading: isLoadingCollectionDocs(state),
    docs: getCollectionDocuments(state),
    facets: getCollectionsFacets(state),
    allFacets: getCollectionsAllFacets(state),
    dataTypeFacets: getCollectionsDataTypeFacets(state),
    dataTypeAllFacets: getCollectionsDataTypeAllFacets(state),
    count: getCollectionCount(state),
    allCount: getCollectionAllCount(state)
  }),
  {
    loadCollectionDocuments,
    unloadCollectionDocuments,
    loadCollectionFacets,
    unloadCollectionFacets
  }
)(Collection);
