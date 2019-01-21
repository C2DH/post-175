import React, { PureComponent } from "react";
import memoize from "memoize-one";
import range from "lodash/range";
import { extent } from "d3-array";
import { scaleLinear } from "d3-scale";
import { line } from "d3-shape";

export default class TimeSerieChart extends PureComponent {
  state = {
    width: null,
    height: null
  };

  componentDidMount() {
    this.setDimensions();
  }

  componentDidUpdate() {
    this.setDimensions();
  }

  setDimensions = () => {
    if (this.cont) {
      const { width, height } = this.cont.getBoundingClientRect();
      if (width !== this.state.width || height !== this.state.height) {
        this.setState({
          width,
          height
        });
      }
    }
  };

  getScale = memoize((serie, yearExtent, width, height) => {
    const indicatorExtent = extent(Object.values(serie));

    const scaleY = scaleLinear()
      .domain(indicatorExtent)
      .range([height - 5, 5]);

    const scaleX = scaleLinear()
      .domain(yearExtent.map(d => d.getFullYear()))
      .range([0, width]);

    return { scaleX, scaleY };
  });

  getCompleteSerie = memoize((serie, yearExtent) => {
    return range(yearExtent[0].getFullYear(), yearExtent[1].getFullYear()).map(
      year => ({
        year,
        value: serie[year]
      })
    );
  });

  getPath = memoize((completeSerie, scaleX, scaleY) => {
    const lineGenerator = line()
      .x(datum => scaleX(datum.year))
      .y(datum => scaleY(datum.value))
      .defined(datum => typeof datum.value !== "undefined");

    return lineGenerator(completeSerie);
  });

  renderChart() {
    const { width, height } = this.state;
    const { serie, yearExtent, year } = this.props;
    const { scaleX, scaleY } = this.getScale(serie, yearExtent, width, height);
    const completeSerie = this.getCompleteSerie(serie, yearExtent);
    const path = this.getPath(completeSerie, scaleX, scaleY);

    return (
      <g>
        <path d={path} stroke="white" fill="none" />
        <circle
          r={5}
          fill="#f8c91c"
          cx={scaleX(year)}
          cy={serie[year] ? scaleY(serie[year]) : scaleY.range()[0]}
        />
      </g>
    );
  }

  render() {
    const { width, height } = this.state;
    return (
      <svg className="h-100 w-100" ref={r => (this.cont = r)}>
        {width !== null && height !== null && this.renderChart()}
      </svg>
    );
  }
}
