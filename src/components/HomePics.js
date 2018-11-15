import React from "react";
import { findIndex } from "lodash";
import ReactDOM from "react-dom";
import { StaggeredMotion, Motion, spring } from "react-motion";
import { scaleLinear } from "d3-scale";

const NUM_PICS = 50;
const MAX_DELTA = 150;
const MIN_DELTA = 10;

class HomePicture extends React.PureComponent {
  render() {
    const { left, width, image, selected, text, index } = this.props;
    return (
      <div
        style={{
          position: "absolute",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundImage: `url(${image})`,
          height: `100%`,
          left,
          width
        }}
      >
        {selected &&
          width > MAX_DELTA / 2 && (
            <Motion defaultStyle={{ y: 700 }} style={{ y: spring(0) }}>
              {({ y }) => (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    left: 0,
                    overflow: "hidden",
                    pointerEvents: "none"
                  }}
                >
                  <div
                    style={{ transform: `translateY(${y}px)` }}
                    className="w-100 bg-overlay text-white d-flex flex-row justify-content-between"
                  >
                    <div className="font-12 m-3">{text}</div>
                  </div>
                </div>
              )}
            </Motion>
          )}
      </div>
    );
  }
}

export default class HomePics extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: null,
      positions: [],
      initialPositions: props.docs.map(_ => [0, 0]),
      width: 0
    };
  }

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);
    const width = node.offsetWidth;
    const itemWidth = width ? width / NUM_PICS : 0;
    const positions = this.props.docs.map((_, i) => {
      const pos = i * itemWidth;
      return [pos, pos + itemWidth];
    });
    this.setState({ width, positions, initialPositions: positions });
  }

  getColor = i => {
    const itemWidth = Math.round(255.0 / NUM_PICS);
    const col = itemWidth * i;
    return `rgb(${col}, ${col}, ${col})`;
  };

  getImage = i => {
    return `url(https://picsum.photos/200/700/?random&ts=${i})`;
  };

  handleMouseMove = e => {
    const { width, initialPositions } = this.state;
    const itemWidth = width / NUM_PICS;
    const numLeft = Math.round(e.clientX / itemWidth);
    const numRight = Math.round((width - e.clientX) / itemWidth);

    let leftRange = MAX_DELTA;
    let rightRange = MAX_DELTA;

    if (e.clientX < MAX_DELTA + MIN_DELTA * numLeft) {
      leftRange = Math.max(e.clientX - MIN_DELTA * numLeft, 0);
      rightRange += Math.min(width - e.clientX, MAX_DELTA - leftRange);
    }

    if (width - e.clientX < MAX_DELTA + MIN_DELTA * numRight) {
      rightRange = Math.max(width - e.clientX - MIN_DELTA * numRight, 0);
      leftRange += Math.min(e.clientX, MAX_DELTA - rightRange);
    }

    const leftScale = scaleLinear()
      .domain([0, e.clientX])
      .range([leftRange, 0]);
    const rightScale = scaleLinear()
      .domain([0, width - e.clientX])
      .range([rightRange, 0]);

    const newPositions = initialPositions.map((pos, i) => {
      let newPos = [];

      if (pos[0] <= e.clientX) {
        newPos[0] = pos[0] - leftScale(e.clientX - pos[0]);
      } else {
        newPos[0] = pos[0] + rightScale(pos[0] - e.clientX);
      }

      if (pos[1] < e.clientX) {
        newPos[1] = pos[1] - leftScale(e.clientX - pos[1]);
      } else {
        newPos[1] = pos[1] + rightScale(pos[1] - e.clientX);
      }

      return newPos;
    });

    const selectedIndex = findIndex(initialPositions, pos => {
      return e.clientX >= pos[0] && e.clientX <= pos[1];
    });

    this.setState({ positions: newPositions, selectedIndex });
  };

  handleMouseLeave = e => {
    this.setState({
      x: null,
      positions: this.state.initialPositions,
      selectedIndex: null
    });
  };

  render() {
    const { positions, initialPositions, selectedIndex } = this.state;
    const { docs } = this.props;

    return (
      <StaggeredMotion
        defaultStyles={initialPositions.map(pos => ({
          left: pos[0],
          width: pos[1] - pos[0]
        }))}
        styles={() =>
          positions.map(pos => ({
            left: spring(pos[0]),
            width: spring(pos[1] - pos[0])
          }))
        }
      >
        {styles => (
          <div
            id="pics-container"
            className="w-100 h-100"
            onMouseLeave={this.handleMouseLeave}
            onMouseMove={this.handleMouseMove}
          >
            {styles.map(({ left, width }, i) => (
              <HomePicture
                selected={i === selectedIndex}
                key={i}
                index={i}
                left={left}
                width={width}
                image={docs[i].attachment}
                text={docs[i].data.title}
              />
            ))}
          </div>
        )}
      </StaggeredMotion>
    );
  }
}
