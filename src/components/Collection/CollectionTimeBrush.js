import React, { PureComponent } from 'react'
import memoize from 'memoize-one'
import { scaleLinear, scaleTime } from 'd3-scale'
import { timeYear } from 'd3-time'
import './Collection.css'

const Ticks = ({ ticks, scale, y }) => (
  <svg className='collection-ticks'>
    {ticks.map(tick=> (
      <text
        key={tick}
        x={scale(tick)}
        y={y}
        className="timeline-nav-tick fill-white">{tick.getFullYear()}</text>
    ))}
  </svg>
)

const Bars = ({ bars, scaleYears, scaleBars, height }) => (
  <svg className='collection-bars'>
    {bars.map(bar => (
      <rect
        key={`${bar.data__year}`}
        x={scaleYears(new Date(+bar.data__year, 1, 1))}
        y={height - scaleBars(bar.count) - 1}
        width={scaleYears(new Date((+bar.data__year) + 1, 1, 1)) - scaleYears(new Date((+bar.data__year), 1, 1))}
        height={scaleBars(bar.count)}
        fill='white'
      />
    ))}
  </svg>
)

const PADDING = 56
const MAX_BAR_HEIGHT = 30

// TODO: Remove hardcoding shit
const extent = [new Date(`1830-01-01`), new Date(`2010-01-01`)]

// Take only the good facets
const filterFacets = facets =>
  facets.filter(v => v.data__year !== null && !isNaN(+v.data__year))

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
    const counts = filterFacets(facets).map(v => v.count)
    const maxCount = Math.max(...counts)
    return scaleLinear().domain([0, maxCount]).range([0, height])
  })

  getScaleYears = memoize((extent, width, padding) => {
    return scaleTime()
      .domain(extent)
      .range([PADDING, width - PADDING])
      .nice(timeYear, 10)
  })

  getBars = memoize(filterFacets)

  render() {
    const { allFacets } = this.props
    const { width } = this.state
    const scaleBars = this.getScaleBars(allFacets.data__year, MAX_BAR_HEIGHT)
    let scaleYears
    let ticks
    let bars
    if (width) {
      scaleYears = this.getScaleYears(extent, width, PADDING)
      ticks = scaleYears.ticks(timeYear.every(10))
      bars = this.getBars(allFacets.data__year)
    }

    return (
      <div className='collection-time-brush' ref={r => this.container = r}>
        {width && <Bars
          height={MAX_BAR_HEIGHT}
          bars={bars}
          scaleYears={scaleYears}
          scaleBars={scaleBars}
        />}
        {width && <Ticks y={12} ticks={ticks} scale={scaleYears} />}
      </div>
    )
  }
}
