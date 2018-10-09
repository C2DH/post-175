import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import SideMenu from '../components/SideMenu'
import CollectionFilters from '../components/Collection/CollectionFilters'
import CollectionList from '../components/Collection/CollectionList'
import CollectionTimeBrush from '../components/Collection/CollectionTimeBrush'
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

class Collection extends PureComponent {
  componentDidMount() {
    this.props.loadCollectionFacets()
    this.props.loadCollectionDocuments()
  }

  componentWillUnmount() {
    this.props.unloadCollectionDocuments()
    this.props.unloadCollectionFacets()
  }

  render() {
    const { docs, facets, allFacets } = this.props
    console.log({ docs, facets, allFacets })
    return (
      <div className='h-100 collection-container'>
        <SideMenu />
        <div className='h-100 with-sidemenu collection'>
          <CollectionFilters />
          {docs && <CollectionList docs={docs} />}
          <CollectionTimeBrush />
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
})(Collection)
