import React, { PureComponent } from 'react'
import memoize from 'memoize-one'
import { DraggableCore } from 'react-draggable'
import { scaleLinear, scaleTime } from 'd3-scale'
import { timeYear } from 'd3-time'
import { extent as makeExtent } from 'd3-array'
import './Collection.css'

const Ticks = ({ ticks, scale, y }) => (
  <g>
    {ticks.map(tick=> (
      <text
        key={tick}
        x={scale(tick)}
        y={y}
        className="timeline-nav-tick fill-white">{tick.getFullYear()}</text>
    ))}
  </g>
)

const Bars = ({ bars, scaleYears, scaleBars, height, fill }) => (
  <g>
    {bars.map(bar => (
      <rect
        key={`${bar.year}`}
        x={scaleYears(new Date(+bar.year, 1, 1))}
        y={height - scaleBars(bar.count) - 1}
        width={scaleYears(new Date((+bar.year) + 1, 1, 1)) - scaleYears(new Date((+bar.year), 1, 1))}
        height={scaleBars(bar.count)}
        fill={fill}
      />
    ))}
  </g>
)

const BRUSH_RADIUS = 12
class Brush extends React.Component {
  handleEndDrag = (e, data) => {
    const { scale, endYear, extent } = this.props
    const x = scale(endYear)
    let newX = x + data.deltaX
    const range = scale.range()
    newX = Math.max(Math.min(newX, range[1]), range[0])
    newX = Math.max(newX, scale(this.props.startYear) + BRUSH_RADIUS)
    const newDate = scale.invert(newX)
    this.props.onChange(this.props.startYear, newDate)

  }

  handleStartDrag = (e, data) => {
    const { scale, startYear, extent } = this.props
    const x = scale(startYear)
    const range = scale.range()
    let newX = x + data.deltaX
    newX = Math.max(Math.min(newX, range[1]), range[0])
    newX = Math.min(newX, scale(this.props.endYear) - BRUSH_RADIUS)
    const newDate = scale.invert(newX)
    this.props.onChange(newDate, this.props.endYear)
  }

  render() {
    const { scale, startYear, endYear, height } = this.props
    console.log(scale, startYear, height)
    return (
      <g>
        <rect
          className='collection-brush'
          x={scale(startYear)} height={height} width={scale(endYear) - scale(startYear)}>

        </rect>
        <DraggableCore onDrag={this.handleStartDrag}>
          <g transform={`translate(${scale(startYear)}, 0)`}>
            <circle r={BRUSH_RADIUS} cx={0} cy={height/2} fill='grey' />
          </g>
        </DraggableCore>
        <DraggableCore onDrag={this.handleEndDrag}>
          <g transform={`translate(${scale(endYear)}, 0)`}>
            <circle r={BRUSH_RADIUS} cx={0} cy={height/2} fill='grey' />
          </g>
        </DraggableCore>

      </g>
    )
  }
}

const PADDING = 56
const MAX_BAR_HEIGHT = 30

export default class CollectionTimeBrush extends PureComponent {
  state = {
    width: null,
    height: null,
  }

  componentDidMount() {
    const width = this.container.clientWidth
    const extent = this.getExtent(this.props.allFacets)
    const scale = this.getScaleYears(extent, width, PADDING)
    this.setState({
      width: width,
      height: this.container.clientHeight,
      startYear: scale.domain()[0],
      endYear: scale.domain()[1],
    })
  }

  getScaleBars = memoize((facets, height) => {
    const counts = facets.map(v => v.count)
    const maxCount = Math.max(...counts)
    return scaleLinear().domain([0, maxCount]).range([0, height])
  })

  getScaleYears = memoize((extent, width, padding) => {
    return scaleTime()
      .domain(extent)
      .range([PADDING, width - PADDING])
      .nice(timeYear, 10)
  })

  getExtent = memoize((allFacets) => {
    return makeExtent(allFacets.data__year, item => item.year)
      .map(year => new Date(`${year}-01-01`))
  })

  onBrushChange = (startYear, endYear) => {
    this.setState({ startYear, endYear })
  }

  render() {
    const { allFacets, facets } = this.props
    const { width, height } = this.state
    const scaleBars = this.getScaleBars(allFacets.data__year, MAX_BAR_HEIGHT)
    const extent = this.getExtent(allFacets)
    let scaleYears
    let ticks
    let bars
    if (width) {
      scaleYears = this.getScaleYears(extent, width, PADDING)
      ticks = scaleYears.ticks(timeYear.every(10))
    }

    return (
      <div className='collection-time-brush' ref={r => this.container = r}>
        {width && <svg className='h-100'>
          <g transform='translate(0, 6)'>
            <Ticks y={MAX_BAR_HEIGHT + 12} ticks={ticks} scale={scaleYears} />
            <Bars
              height={MAX_BAR_HEIGHT}
              bars={allFacets.data__year}
              scaleYears={scaleYears}
              scaleBars={scaleBars}
              fill={'grey'}
            />
            <Bars
              height={MAX_BAR_HEIGHT}
              bars={facets.data__year}
              scaleYears={scaleYears}
              scaleBars={scaleBars}
              fill={'white'}
            />
          </g>
          <g>
            <Brush
              height={height}
              startYear={this.state.startYear}
              endYear={this.state.endYear}
              onChange={this.onBrushChange}
              scale={scaleYears}
            />
          </g>
        </svg>}
      </div>
    )
  }
}
