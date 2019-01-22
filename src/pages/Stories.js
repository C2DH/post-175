import React, { Component } from 'react'
import { connect } from 'react-redux'
import padStart from 'lodash/padStart'
import get from 'lodash/get'
import { loadChapters, unloadChapters } from '../state/actions'
import { getChapters } from '../state/selectors'
import StoryCard from '../components/StoryCard'
import SideMenu from '../components/SideMenu'

class Stories extends Component {
  componentDidMount() {
    this.props.loadChapters()
  }

  componentWillUnmount() {
    this.props.unloadChapters()
  }

  render() {
    const { chapters } = this.props
    return (
      <div className='h-100'>
        <SideMenu />
        <div className='h-100 with-sidemenu'>
          <div className='bg-dark text-white p-2'>
            <h1>Dossiers thématique</h1>
          </div>
          <div className='d-flex h-100' style={{ overflowY: 'auto' }}>
            {chapters && chapters.map((chapter, i) => (
              <StoryCard
                count={padStart(i + 1, 2, 0)}
                image={get(chapter, 'covers[0].data.resolutions.medium.url')}
                key={chapter.id}
                slug={chapter.slug}
                title={chapter.data.title}
                description={chapter.data.abstract}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default connect(state => ({
  chapters: getChapters(state),
}), {
  loadChapters,
  unloadChapters,
})(Stories)
