import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
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
    const { story } = this.props
    return (
      <div className='h-100 d-flex flex-column'>
        <TopBar />
        <div className='flex-1 bg-opaque-black bg-warningx p-4 d-flex'>
          <div className='bg-infoz flex-1'>
            <h1 className='text-light font-weight-light text-capitalize'>  {story?story.data.title:''}</h1>
          </div>
          <div className='bg-dangerz flex-2 px-5'>
            <p>
              {story?story.data.abstract:''}
            </p>
          </div>
          <div className='bg-warningz flex-1'>
            <div>Partners</div>
            <div>Credits</div>
          </div>

        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  story: getStory(state),
})
export default connect(mapStateToProps, {
  loadStory,
  unloadStory,
})(About)
