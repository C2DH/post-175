import ReactDOM from 'react-dom'
import React, { PureComponent } from 'react'
import clamp from './clamp'

const supportsNativeClamp =
  typeof window.document.createElement('div').style.webkitLineClamp !==
  'undefined'

export default class MagikDotDotDot extends PureComponent {
  componentDidMount() {
    // Nothing to do
    if (supportsNativeClamp) {
      return
    }
    this.makeClamp()
    window.addEventListener('resize', this.makeClamp, false)
  }

  componentWillReceiveProps(nextProps) {
    // Nothing to do
    if (supportsNativeClamp) {
      return
    }
    if (nextProps.children !== this.props.children) {
      // Reset the original node!
      this.original = null
    }
  }

  componentDidUpdate() {
    // Nothing to do
    if (supportsNativeClamp) {
      return
    }
    this.makeClamp()
  }

  componentWillUnmount() {
    // Nothing to do
    if (supportsNativeClamp) {
      return
    }
    window.removeEventListener('resize', this.makeClamp, false)
  }

  makeClamp = () => {
    const element = ReactDOM.findDOMNode(this.container)
    if (!this.original) {
      this.original = element.cloneNode(true)
    }
    // TODO: Find a fast way
    element.innerHTML = this.original.innerHTML
    // Call the devil !
    clamp(element, {
      clamp: this.props.clamp,
      useNativeClamp: false,
      truncationChar: '\u2026',
    })
  }

  render() {
    const { children, clamp, ...passProps } = this.props

    if (supportsNativeClamp) {
      return (
        <div
          {...passProps}
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            WebkitBoxOrient: 'vertical',
            display: '-webkit-box',
            WebkitLineClamp: clamp,
          }}>
          {children}
        </div>
      )
    } else {
      return (
        <div {...passProps} ref={ref => this.container = ref}>{children}</div>
      )
    }
  }
}
