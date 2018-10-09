import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import SideMenu from '../components/SideMenu'
import CollectionFilters from '../components/Collection/CollectionFilters'
import CollectionList from '../components/Collection/CollectionList'
import CollectionTimeBrush from '../components/Collection/CollectionTimeBrush'
import { loadCollectionDocuments, unloadCollectionDocuments } from '../state/actions'
import { getCollectionDocuments } from '../state/selectors'

class Collection extends PureComponent {
  componentDidMount() {
    this.props.loadCollectionDocuments()
  }

  componentWillUnmount() {
    this.props.unloadCollectionDocuments()
  }

  render() {
    const { docs } = this.props
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
}), {
  loadCollectionDocuments,
  unloadCollectionDocuments,
})(Collection)
