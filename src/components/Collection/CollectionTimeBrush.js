import React, { PureComponent } from 'react'
import memoize from 'memoize-one'
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

const PADDING = 56
const MAX_BAR_HEIGHT = 30

export default class CollectionTimeBrush extends PureComponent {
  state = {
    width: null,
  }

  componentDidMount() {
    this.setState({
      width: this.container.clientWidth,
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

  render() {
    const { allFacets, facets } = this.props
    const { width } = this.state
    const scaleBars = this.getScaleBars(allFacets.data__year, MAX_BAR_HEIGHT)
    const extent = makeExtent(allFacets.data__year, item => item.year)
      .map(year => new Date(`${year}-01-01`))
    let scaleYears
    let ticks
    let bars
    console.log(facets, allFacets)
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
        </svg>}
      </div>
    )
  }
}
