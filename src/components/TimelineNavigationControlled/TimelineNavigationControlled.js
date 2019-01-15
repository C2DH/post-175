import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import { defaultMemoize } from "reselect";
import { scaleTime } from "d3-scale";
import { timeYear } from "d3-time";
import { DraggableCore } from "react-draggable";
import { Motion, spring, presets } from "react-motion";
import { getEventColor } from "../../utils";
import "./TimelineNavigationControlled.scss";

const BOTTOM_HEIGHT = 80;
const NAVIGATION_PADDING = 30;
const CURSOR_RADIUS = NAVIGATION_PADDING / 2;

class TimelineCursor extends PureComponent {
  onDrag = (e, data) => {
    const { scale, currentDate, onDateChange, extent } = this.props;
    const x = scale(currentDate);
    const newX = x + data.deltaX;
    const newDate = scale.invert(newX);
    const scaleDomain = scale.domain();
    if (newDate < scaleDomain[0] || newDate > extent[1]) {
      return;
    }
    onDateChange(newDate);
  };

  render() {
    const { currentDate, scale, height, cursorRadius } = this.props;
    const x = scale(currentDate) - cursorRadius;
    return (
      <Motion
        defaultStyle={{ x: x }}
        style={{
          x: spring(x, { precision: 0.01, stiffness: 580, damping: 40 })
        }}
      >
        {({ x }) => (
          <DraggableCore handle=".timeline-handle" onDrag={this.onDrag}>
            <svg
              height={cursorRadius * 2}
              width={cursorRadius * 2}
              style={{ transform: `translate(${x}px, 0px)` }}
            >
              <circle
                className="timeline-handle"
                r={cursorRadius / 2}
                cx={cursorRadius}
                cy={cursorRadius}
                fill="white"
              />
            </svg>
          </DraggableCore>
        )}
      </Motion>
    );
  }
}

export class TimelineTicks extends PureComponent {
  render() {
    const { ticks, scale, y } = this.props;
    return (
      <svg className="w-100 flex-1">
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
      </svg>
    );
  }
}

export class TimelineEvents extends PureComponent {
  render() {
    const { events, scale, cy, onClick } = this.props;
    return (
      <svg className="w-100 flex-1">
        {events.map(event => (
          <circle
            className="pointer"
            onClick={() => onClick(event)}
            fill={getEventColor(event)}
            key={event.id}
            cx={scale(event.startDate)}
            r={5}
            cy={cy}
          />
        ))}
      </svg>
    );
  }
}

const getScale = defaultMemoize((extent, width, padding) => {
  const scale = scaleTime()
    .domain(extent)
    .range([padding, width - padding])
    .nice(timeYear, 10);
  return scale;
});

const getTicks = defaultMemoize(scale => scale.ticks(timeYear.every(10)));

class TimelineNavigationControlled extends PureComponent {
  state = {
    width: 0,
    height: 0
  };

  componentDidMount() {
    this.getDimensions();
    window.addEventListener("resize", this.getDimensions, false);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.getDimensions);
  }

  getDimensions = () => {
    // Get dimensions of current container
    const node = ReactDOM.findDOMNode(this);
    const width = node.offsetWidth;
    const height = node.offsetHeight;
    this.setState({ width, height });
  };

  render() {
    const { width, height } = this.state;
    const {
      extent,
      padding,
      style,
      className,
      children,
      currentDate,
      onDateChange,
      cursorRadius,
      renderTop,
      bottomHeight
    } = this.props;

    const scale = getScale(extent, width, padding);
    const ticks = getTicks(scale);

    return (
      <div
        className={classNames(
          "timeline-nav w-100 d-flex flex-column",
          className
        )}
        style={style}
      >
        {renderTop && renderTop({ scale, width })}

        <div style={{ height: bottomHeight }} className="d-flex flex-column">
          {children && children({ scale, ticks, width, height: bottomHeight })}
        </div>

        <div className="position-absolute w-100" style={{ bottom: 28 }}>
          <div
            className="bg-black"
            style={{
              borderRadius: cursorRadius / 4,
              position: "absolute",
              top: (cursorRadius / 4) * 3,
              height: cursorRadius / 2,
              left: scale(extent[0]),
              width: scale(extent[1]) - scale(extent[0])
            }}
          />
          <TimelineCursor
            currentDate={currentDate}
            onDateChange={onDateChange}
            cursorRadius={cursorRadius}
            height={height}
            extent={extent}
            scale={scale}
          />
        </div>
      </div>
    );
  }
}

TimelineNavigationControlled.defaultProps = {
  padding: NAVIGATION_PADDING,
  cursorRadius: CURSOR_RADIUS,
  // The height of black timeline section \w events and ticks...
  bottomHeight: BOTTOM_HEIGHT
};

export default TimelineNavigationControlled;
