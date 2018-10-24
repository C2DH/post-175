import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import qs from 'query-string'
import get from 'lodash/get'
import SideMenu from '../components/SideMenu'
import CollectionFilters from '../components/Collection/CollectionFilters'
import CollectionList from '../components/Collection/CollectionList'
import CollectionTimeBrush from '../components/Collection/CollectionTimeBrush'
import { COLLECTION_DATE_TYPES } from '../consts'
import {
  loadCollectionDocuments,
  unloadCollectionDocuments,
  loadCollectionFacets,
  unloadCollectionFacets,
} from '../state/actions'
import {
  getCollectionDocuments,
  getCollectionsFacets,
  getCollectionsAllFacets,
} from '../state/selectors'

const parseQsAsList = str => str.split(',').filter(Boolean)

class Collection extends PureComponent {
  componentDidMount() {
    const queryParams = qs.parse(this.props.location.search)
    this.loadDocs(this.parseQueryParams(queryParams))
    this.props.loadCollectionFacets({
      filters: {
        data__type__in: COLLECTION_DATE_TYPES,
      },
    })
  }

  componentDidUpdate(prevProps) {
    const prevQueryParams = qs.parse(prevProps.location.search)
    const queryParams = qs.parse(this.props.location.search)
    if (
      prevQueryParams.search !== queryParams.search ||
      prevQueryParams.categories !== queryParams.categories
    ) {
      this.loadDocs(this.parseQueryParams(queryParams))
    }
  }

  componentWillUnmount() {
    this.props.unloadCollectionDocuments()
    this.props.unloadCollectionFacets()
  }

  loadDocs = ({ categories, search }) => {
    this.props.loadCollectionDocuments({
      filters: {
        data__type__in: categories.length > 0 ? categories : COLLECTION_DATE_TYPES,
      },
      q: search,
    })
  }

  parseQueryParams = queryParams => {
    const search = get(queryParams, 'search', '')
    const categories = parseQsAsList(get(queryParams, 'categories', ''))
    return { search, categories }
  }

  handleOnSearchChange = search => {
    const { location } = this.props
    const queryParams = qs.parse(location.search)

    this.props.history.push(`${location.pathname}?${qs.stringify({
      ...queryParams,
      search
    }, {
      encode: false,
    })}`)
  }

  handleToggleCategory = category => {
    const { location } = this.props
    const queryParams = qs.parse(location.search)
    const oldCategories = parseQsAsList(get(queryParams, 'categories', ''))
    const categories = oldCategories.indexOf(category) === -1
      ? oldCategories.concat(category)
      : oldCategories.filter(cat => cat !== category)

    this.props.history.push(`${location.pathname}?${qs.stringify({
      ...queryParams,
      categories: categories.join(','),
    }, {
      encode: false,
    })}`)
  }

  render() {
    const { docs, facets, allFacets, location } = this.props
    const queryParams = qs.parse(location.search)
    const { search, categories } = this.parseQueryParams(queryParams)

    return (
      <div className='h-100 collection-container'>
        <SideMenu />
        <div className='h-100 with-sidemenu collection'>
          <CollectionFilters
            locationKey={location.key}
            search={search}
            onSearchChange={this.handleOnSearchChange}
            categories={categories}
            onToggleCategory={this.handleToggleCategory}
          />
          {docs && <CollectionList docs={docs} />}
          {allFacets && <CollectionTimeBrush
            allFacets={allFacets}
          />}
        </div>
      </div>
    )
  }
}

export default connect(state => ({
  docs: getCollectionDocuments(state),
  facets: getCollectionsFacets(state),
  allFacets: getCollectionsAllFacets(state),
}), {
  loadCollectionDocuments,
  unloadCollectionDocuments,
  loadCollectionFacets,
  unloadCollectionFacets,
})(Collection)
