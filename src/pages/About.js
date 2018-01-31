import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { localize } from '../localize'
import {
  loadStory,
  unloadStory,
} from '../state/actions'
import {
  getStory,
} from '../state/selectors'
import TopBar from '../components/TopBar'

class About extends PureComponent {
  componentDidMount() {
    this.props.loadStory('about')
  }

  componentWillUnmount() {
    this.props.unloadStory()
  }

  render() {
    const { story, t } = this.props
    return (
      <div className='h-100 d-flex flex-column'>
        <TopBar />
        <div className='flex-1 bg-opaque-black bg-warningx p-4 d-flex'>
          <div className='bg-infoz flex-1'>
            <h1 className='text-light font-weight-light text-capitalize'>  {story?story.data.title:''}</h1>
          </div>
          <div className='bg-dangerz flex-2 px-5'>
            <p className="about-text">
              {story?story.data.abstract:''}
            </p>
          </div>
          <div className='bg-warningz flex-1'>
            <div><h6>{t('partners')}</h6></div>
            <div className="d-flex flex-column">
              <img className="about-logo" src="/img/unilu.jpg"></img>
              <img className="about-logo" src="/img/c2dh.jpg"></img>
              <img className="about-logo rounded-circle" src="/img/post.png"></img>
            </div>
          </div>

        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  story: getStory(state),
})

export default localize()(connect(mapStateToProps, {
  loadStory,
  unloadStory,
})(About))
