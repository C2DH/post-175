import React, { Component } from 'react'
import ReactHammer from 'react-hammerjs'
import Hammer from 'hammerjs'
import './ZoomAndPanMedia.css'

const PINCH_TIMEOUT = 300

export default class ZoomAndPanMedia extends Component {
  state = {
    zoom: 1,
    pinchingZoom: 1,
    lastPinchedAt: 0,
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
    const zoom = +e.target.value
    this.setState({
      pinchingZoom: 1,
      zoom,
      ...this.boundsDeltas(deltaX, deltaY, zoom),
    })
  }

  handlePinch = e => {
    const pinchingZoom = +e.scale
    this.setState({
      pinchingZoom,
    })
  }

  handlePinchEnd = e => {
    const { deltaX, deltaY, zoom } = this.state
    let newZoom = zoom * e.scale
    newZoom = Math.max(Math.min(newZoom, 4), 1)

    this.setState({
      pinchingZoom: 1,
      lastPinchedAt: new Date().getTime(),
      zoom: newZoom,
      ...this.boundsDeltas(deltaX, deltaY, newZoom),
    })
  }

  handlePan = e => {
    if (this.state.pinchingZoom !== 1 || new Date().getTime() - this.state.lastPinchedAt < PINCH_TIMEOUT) {
      return
    }
    this.setState({
      panDeltaX: +e.deltaX,
      panDeltaY: +e.deltaY
    })
  }

  handlePanEnd = e => {
    if (this.state.pinchingZoom !== 1 || new Date().getTime() - this.state.lastPinchedAt < PINCH_TIMEOUT) {
      return
    }
    const { maxHeight, maxWidth, zoom, pinchingZoom } = this.state

    let deltaX = +e.deltaX + this.state.deltaX
    let deltaY = +e.deltaY + this.state.deltaY

    this.setState({
      panDeltaX: 0,
      panDeltaY: 0,
      ...this.boundsDeltas(deltaX, deltaY, zoom * pinchingZoom),
    })
  }

  getTransform = () => {
    const { deltaX, deltaY, panDeltaY, panDeltaX, zoom, pinchingZoom } = this.state
    const translateDeltaX = deltaX + panDeltaX
    const translateDeltaY = deltaY + panDeltaY
    const scale = zoom * pinchingZoom
    return `translate(${translateDeltaX}px, ${translateDeltaY}px) scale(${scale})`
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
                },
                pinch: {
                  enable: true
                },
              }
            }}
            onPinch={this.handlePinch}
            onPinchEnd={this.handlePinchEnd}
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
