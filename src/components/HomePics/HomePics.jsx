import React from "react";
import { findIndex, range, sampleSize } from "lodash";
import ReactDOM from "react-dom";
import { StaggeredMotion, Motion, spring } from "react-motion";
import { scaleLinear } from "d3-scale";
import memoize from "memoize-one";
import classNames from "classnames";
import "./HomePics.scss";

const NUM_PICS = 50;
const MAX_DELTA = 170;
const MIN_DELTA = 10;

class HomePicture extends React.PureComponent {
  render() {
    const {
      left,
      width,
      image,
      selected,
      text,
      index,
      percentHeight,
    } = this.props;
    return (
      <div
        style={{
          borderRight: selected ? 0 : `${parseInt(width / 10)}px solid black`,
          borderLeft: selected ? 0 : `${parseInt(width / 10)}px solid black`,
          position: "absolute",
          //backgroundSize: `${selected ? "contain" : "cover"}`,
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url(${image})`,
          top: selected ? 0 : `${(100 - percentHeight) / 2}%`,
          height: selected ? "100%" : `${percentHeight}%`,
          left,
          width,
        }}
        className={classNames("pic-content", {
          selected: selected,
        })}
      >
        {selected && width > MAX_DELTA / 2 && (
          <Motion defaultStyle={{ y: 700 }} style={{ y: spring(0) }}>
            {({ y }) => (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  left: 0,
                  overflow: "hidden",
                  pointerEvents: "none",
                }}
                className="d-none d-md-block"
              >
                <div
                  style={{ transform: `translateY(${y}px)` }}
                  className="w-100 bg-black text-white d-flex flex-row justify-content-between"
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
      initialPositions: props.docs.map((_) => [0, 0]),
      width: 0,
    };
  }

  componentDidMount() {
    this.calculatePosition();
    window.addEventListener("resize", this.calculatePosition);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.calculatePosition);
  }

  calculatePosition = () => {
    const node = ReactDOM.findDOMNode(this);
    const width = node.offsetWidth;
    const itemWidth = width ? width / NUM_PICS : 0;
    const positions = this.props.docs.map((_, i) => {
      const pos = i * itemWidth;
      return [pos, pos + itemWidth];
    });
    this.setState({ width, positions, initialPositions: positions });
  };

  getColor = (i) => {
    const itemWidth = Math.round(255.0 / NUM_PICS);
    const col = itemWidth * i;
    return `rgb(${col}, ${col}, ${col})`;
  };

  getImage = (i) => {
    return `url(https://picsum.photos/200/700/?random&ts=${i})`;
  };

  handleMouseMove = (e) => {
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

    const selectedIndex = findIndex(initialPositions, (pos) => {
      return e.clientX >= pos[0] && e.clientX <= pos[1];
    });

    this.setState({ positions: newPositions, selectedIndex });
  };

  handleMouseLeave = (e) => {
    this.setState({
      x: null,
      positions: this.state.initialPositions,
      selectedIndex: null,
    });
  };

  randomicHeights = memoize((n) => {
    const MIN = 30;
    const scale = scaleLinear()
      .domain([0, n - 1])
      .range([0, 4 * Math.PI]);

    const randomic = range(n).map((i) => {
      let noise = Math.floor(Math.random() * 20) - 10;
      return noise + 20 + parseInt(Math.abs(Math.sin(scale(i)) * 60));
    });
    const swapper = sampleSize(range(n - 1), 10);
    // console.log('Un', [...randomic])
    swapper.forEach((swap) => {
      // console.log("S", swap)
      const appo = randomic[swap];
      randomic[swap] = randomic[swap + 1];
      randomic[swap + 1] = appo;
    });
    // console.log('Dos', [...randomic])
    return randomic;
  });

  render() {
    const { positions, initialPositions, selectedIndex } = this.state;
    const { docs } = this.props;
    const percentHeights = this.randomicHeights(docs.length);

    return (
      <StaggeredMotion
        defaultStyles={initialPositions.map((pos) => ({
          left: pos[0],
          width: pos[1] - pos[0],
        }))}
        styles={() =>
          positions.map((pos) => ({
            left: spring(pos[0]),
            width: spring(pos[1] - pos[0]),
          }))
        }
      >
        {(styles) => (
          <div
            id="pics-container"
            className="w-100 h-100"
            onMouseLeave={this.handleMouseLeave}
            onMouseMove={this.handleMouseMove}
          >
            {styles.map(({ left, width }, i) => (
              <HomePicture
                percentHeight={percentHeights[i]}
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
