import React, { PureComponent } from "react";
import memoize from "memoize-one";
import debounce from "lodash/debounce";
import { DraggableCore } from "react-draggable";
import { scaleLinear, scaleTime } from "d3-scale";
import { timeYear } from "d3-time";
import { extent as makeExtent } from "d3-array";
import "./Collection.scss";

const Ticks = ({ ticks, scale, y }) => (
  <g>
    {ticks.map(tick => (
      <text
        key={tick}
        x={scale(tick)}
        y={y}
        className="timeline-nav-tick fill-white"
      >
        {tick.getFullYear()}
      </text>
    ))}
  </g>
);

const Bars = ({ bars, scaleYears, scaleBars, height, fill }) => (
  <g>
    {bars.map(bar => (
      <rect
        key={`${bar.year}`}
        x={scaleYears(new Date(+bar.year, 1, 1))}
        y={height - scaleBars(bar.count) - 1}
        width={
          scaleYears(new Date(+bar.year + 1, 1, 1)) -
          scaleYears(new Date(+bar.year, 1, 1))
        }
        height={scaleBars(bar.count)}
        fill={fill}
      />
    ))}
  </g>
);

const BRUSH_RADIUS = 9;
class Brush extends React.Component {
  handleEndDrag = (e, data) => {
    const { scale, endYear, extent } = this.props;
    const x = scale(endYear);
    let newX = x + data.deltaX;
    const range = scale.range();
    newX = Math.max(Math.min(newX, range[1]), range[0]);
    newX = Math.max(newX, scale(this.props.startYear) + BRUSH_RADIUS);
    const newDate = scale.invert(newX);
    this.props.onChange(this.props.startYear, newDate);
  };

  handleStartDrag = (e, data) => {
    const { scale, startYear, extent } = this.props;
    const x = scale(startYear);
    const range = scale.range();
    let newX = x + data.deltaX;
    newX = Math.max(Math.min(newX, range[1]), range[0]);
    newX = Math.min(newX, scale(this.props.endYear) - BRUSH_RADIUS);
    const newDate = scale.invert(newX);
    this.props.onChange(newDate, this.props.endYear);
  };

  render() {
    const { scale, startYear, endYear, height } = this.props;
    const range = scale.range();
    return (
      <g>
        {/* <rect
          className='collection-brush'
          x={scale(startYear)} height={height} width={scale(endYear) - scale(startYear)}>
        </rect> */}
        <line
          x1={range[0]}
          y1={height}
          strokeWidth={2}
          x2={range[1]}
          y2={height}
          stroke={"grey"}
          fill={"grey"}
        />
        <line
          x1={scale(startYear)}
          y1={height}
          strokeWidth={2}
          x2={scale(endYear)}
          y2={height}
          stroke={"#f8c91c"}
          fill={"#f8c91c"}
        />
        <DraggableCore onDrag={this.handleStartDrag}>
          <g transform={`translate(${scale(startYear)}, 0)`}>
            <circle r={BRUSH_RADIUS} cx={0} cy={height} fill="#f8c91c" />
          </g>
        </DraggableCore>
        <DraggableCore onDrag={this.handleEndDrag}>
          <g transform={`translate(${scale(endYear)}, 0)`}>
            <circle r={BRUSH_RADIUS} cx={0} cy={height} fill="#f8c91c" />
          </g>
        </DraggableCore>
      </g>
    );
  }
}

const PADDING = 0;
const MAX_BAR_HEIGHT = 30;

const makeExtentFromFacets = facets =>
  makeExtent(facets.data__year, item => item.year).map(
    year => new Date(`${year}-01-01`)
  );

export default class CollectionTimeBrush extends PureComponent {
  constructor(props) {
    super(props);

    const domain = scaleTime()
      .domain(makeExtentFromFacets(props.allFacets))
      .nice(timeYear, 10)
      .domain();

    const startYear = props.startYear ? props.startYear : domain[0];
    const endYear = props.endYear ? props.endYear : domain[1];

    this.state = {
      startYear,
      endYear,
      prevLocationKey: props.locationKey,
      width: null,
      height: null
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.prevLocationKey !== props.locationKey) {
      if (
        props.startYear &&
        props.endYear &&
        (props.startYear.getFullYear() !== state.startYear.getFullYear() ||
          props.endYear.getFullYear() !== state.endYear.getFullYear())
      ) {
        return {
          startYear: props.startYear,
          endYear: props.endYear,
          prevLocationKey: props.locationKey
        };
      }
      return {
        prevLocationKey: props.locationKey
      };
    }
    return null;
  }

  componentDidMount() {
    this.setState({
      width: this.container.clientWidth,
      height: this.container.clientHeight
    });
  }

  getScaleBars = memoize((facets, height) => {
    const counts = facets.map(v => v.count);
    const maxCount = Math.max(...counts);
    return scaleLinear()
      .domain([0, maxCount])
      .range([0, height]);
  });

  getScaleYears = memoize((extent, width, padding) => {
    return scaleTime()
      .domain(extent)
      .range([PADDING, width - PADDING])
      .nice(timeYear, 10);
  });

  getExtent = memoize(makeExtentFromFacets);

  onBrushChange = (startYear, endYear) => {
    this.setState({ startYear, endYear });
    this.debouncedOnYearsChange(startYear, endYear);
  };

  debouncedOnYearsChange = debounce(this.props.onYearsChange, 150);

  render() {
    const {
      allFacets,
      facets,
      includeUncertain,
      toggleUncertain,
      t
    } = this.props;
    const { width, height, startYear, endYear } = this.state;
    const scaleBars = this.getScaleBars(allFacets.data__year, height);
    const extent = this.getExtent(allFacets);
    let scaleYears;
    let ticks;
    let bars;
    if (width) {
      scaleYears = this.getScaleYears(extent, width, PADDING);
      ticks = scaleYears.ticks(timeYear.every(10));
    }

    return (
      <div className="filter-brush-container pr-md-4 pr-0 my-3 d-flex flex-column h-100">
        <div className="collection-time-brush" ref={r => (this.container = r)}>
          {width && (
            <svg style={{ height, width, overflow: "visible" }}>
              <g transform="translate(0, 0)">
                {/* <Ticks y={MAX_BAR_HEIGHT + 12} ticks={ticks} scale={scaleYears} /> */}
                <Bars
                  height={height}
                  bars={allFacets.data__year}
                  scaleYears={scaleYears}
                  scaleBars={scaleBars}
                  fill={"grey"}
                />
                <Bars
                  height={height}
                  bars={facets.data__year}
                  scaleYears={scaleYears}
                  scaleBars={scaleBars}
                  fill={"white"}
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
            </svg>
          )}
        </div>
        <div className="filter-brush-bottom">
          <div className="custom-control custom-checkbox order-1 order-md-0 mt-2 mt-md-0">
            <input
              type="checkbox"
              className="custom-control-input"
              onChange={() => toggleUncertain()}
              checked={includeUncertain}
              id="uncertainCheckbox"
              name="uncertainCheckbox"
            />
            <label className="custom-control-label" htmlFor="uncertainCheckbox">
              {t("uncertain_dates")}
            </label>
          </div>
          <div className="order-0 order-md-1 d-flex justify-content-center">
            {startYear.getFullYear()}
            {" - "}
            {endYear.getFullYear()}
          </div>
        </div>
      </div>
    );
  }
}
