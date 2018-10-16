import React, { Component } from 'react'
import ReactHammer from 'react-hammerjs'
import Hammer from 'hammerjs'
import './ZoomAndPanMedia.css'

export default class ZoomAndPanMedia extends Component {
  state = {
    zoom: 1,
    deltaX: 0,
    deltaY: 0,
    panDeltaX: 0,
    panDeltaY: 0,
    maxWidth: 0,
    maxHeight: 0
  }

  boundsDeltas = (deltaX, deltaY, zoom) => {
    const { maxHeight, maxWidth } = this.state

    const maxDeltaX = (maxWidth * (+zoom - 1)) / 2
    const maxDeltaY = (maxHeight * (+zoom - 1)) / 2

    const boundedDeltaX = Math.max(Math.min(deltaX, maxDeltaX), -maxDeltaX)
    const boundedDeltaY = Math.max(Math.min(deltaY, maxDeltaY), -maxDeltaY)

    return {
      deltaX: boundedDeltaX,
      deltaY: boundedDeltaY,
    }
  }

  handleZoom = e => {
    const { deltaX, deltaY } = this.state
    const zoom = e.target.value
    this.setState({
      zoom,
      ...this.boundsDeltas(deltaX, deltaY, zoom),
    })
  }

  handlePan = e => {
    this.setState({
      panDeltaX: +e.deltaX,
      panDeltaY: +e.deltaY
    })
  }

  handlePanEnd = e => {
    const { maxHeight, maxWidth, zoom } = this.state

    let deltaX = +e.deltaX + this.state.deltaX
    let deltaY = +e.deltaY + this.state.deltaY

    this.setState({
      panDeltaX: 0,
      panDeltaY: 0,
      ...this.boundsDeltas(deltaX, deltaY, zoom),
    })
  }

  getTransform = () => {
    const deltaX = this.state.deltaX + this.state.panDeltaX
    const deltaY = this.state.deltaY + this.state.panDeltaY
    return `translate(${deltaX}px, ${deltaY}px) scale(${this.state.zoom})`
  };

  onLoadImage = (e) => {
    this.setState({
      maxWidth: e.target.width,
      maxHeight: e.target.height,
    })
  }

  render() {
    const { src } = this.props
    return (
      <div className='zoom-and-pan-media'>
        <div className='p-2 d-flex justify-content-center'>
          <input
            value={this.state.zoom}
            onChange={this.handleZoom}
            type='range'
            min={1}
            max={4}
            step={0.01}
          />
        </div>
        <div className='zoom-and-pan-media-container'>
          <ReactHammer
            options={{
              recognizers: {
                pan: {
                  enable: true,
                  direction: Hammer.DIRECTION_ALL,
                }
              }
            }}
            // onPinch={e => console.log(e)}
            onPan={this.handlePan}
            onPanEnd={this.handlePanEnd}
          >
            <img
              onLoad={this.onLoadImage}
              draggable="false"
              style={{ transform: this.getTransform() }}
              className="zoomable"
              src={src}
            />
          </ReactHammer>
        </div>
      </div>
    )
  }
}
