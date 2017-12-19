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
            <h1 className='text-light font-weight-light'>About</h1>
          </div>
          <div className='bg-dangerz flex-2 px-5'>
            <p>Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Etiam porta sem malesuada magna mollis euismod. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.

Cras mattis consectetur purus sit amet fermentum. Sed posuere consectetur est at lobortis. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vestibulum id ligula porta felis euismod semper. Donec ullamcorper nulla non metus auctor fringilla. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed diam eget risus varius blandit sit amet non magna. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.

Donec sed odio dui. Etiam porta sem malesuada magna mollis euismod. Curabitur blandit tempus porttitor. Sed posuere consectetur est at lobortis. Nullam id dolor id nibh ultricies vehicula ut id elit. Donec ullamcorper nulla non metus auctor fringilla.</p>
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
