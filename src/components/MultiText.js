import React from "react";
import { sum } from "lodash";

const RECT_PADDING = 5;
const CHAR_W = {
  A: 7,
  a: 7,
  B: 8,
  b: 7,
  C: 8,
  c: 6,
  D: 9,
  d: 7,
  E: 7,
  e: 7,
  F: 7,
  f: 4,
  G: 9,
  g: 7,
  H: 9,
  h: 7,
  I: 3,
  i: 3,
  J: 5,
  j: 3,
  K: 8,
  k: 6,
  L: 7,
  l: 3,
  M: 11,
  m: 11,
  N: 9,
  n: 7,
  O: 9,
  o: 7,
  P: 8,
  p: 7,
  Q: 9,
  q: 7,
  R: 8,
  r: 4,
  S: 8,
  s: 6,
  T: 7,
  t: 4,
  U: 9,
  u: 7,
  V: 7,
  v: 6,
  W: 11,
  w: 9,
  X: 7,
  x: 6,
  Y: 7,
  y: 6,
  Z: 7,
  z: 5,
  ".": 2,
  ",": 2,
  ":": 2,
  ";": 2
};

function textWrap(line, maxCharactersPerLine, minCharactersPerLine, monospace) {
  var l,
    lines = [],
    w = [],
    words = [],
    w1,
    maxChars,
    minChars,
    maxLineW,
    minLineW;
  w1 = line.split(" ");
  w1.forEach(function(s, i) {
    var w2 = s.split("-");
    if (w2.length > 1) {
      w2.forEach(function(t, j) {
        w.push(t + (j < w2.length - 1 ? "-" : ""));
      });
    } else {
      w.push(s + (i < w1.length - 1 ? " " : ""));
    }
  });
  maxChars = maxCharactersPerLine || 40;
  minChars =
    minCharactersPerLine ||
    Math.max(
      3,
      Math.min(
        maxChars * 0.5,
        0.75 * w.map(word_len).sort(num_asc)[Math.round(w.length / 2)]
      )
    );
  maxLineW = maxChars * CHAR_W.a;
  minLineW = minChars * CHAR_W.a;
  l = 0;
  w.forEach(function(d) {
    var ww = sum(d.split("").map(char_w));
    if (l + ww > maxLineW && l > minLineW) {
      lines.push(words.join(""));
      words.length = 0;
      l = 0;
    }
    l += ww;
    return words.push(d);
  });
  if (words.length) {
    lines.push(words.join(""));
  }
  return lines.filter(function(d) {
    return d !== "";
  });
  function char_w(c) {
    return (!monospace && CHAR_W[c]) || CHAR_W.a;
  }
  function word_len(d) {
    return d.length;
  }
  function num_asc(a, b) {
    return a - b;
  }
}

export default class MultiText extends React.PureComponent {
  state = {
    bgWidth: 0
  };

  componentDidMount() {
    const { width } = this.textNode.getBoundingClientRect();
    this.setState({
      bgWidth: width
    });
  }

  render() {
    const {
      x,
      y,
      text,
      maxLen = 20,
      minLen,
      monospace,
      spacing = 25,
      maxLine,
      ...rest
    } = this.props;
    const { bgWidth } = this.state;
    let wrapped = textWrap(text, maxLen, minLen, monospace)
    if (maxLine && wrapped.length > maxLine) {
      wrapped = wrapped.slice(0, maxLine)
      wrapped[maxLine - 1] += '...'
    }

    return (
      <g>
        <rect
          x={-RECT_PADDING}
          y={y - spacing + Math.round(spacing / 3) - RECT_PADDING}
          fill="black"
          height={wrapped.length * spacing + RECT_PADDING * 2}
          width={bgWidth + RECT_PADDING * 2}
        />
        <text x={x} y={y} {...rest} ref={r => (this.textNode = r)}>
          {wrapped.map((line, i) => (
            <tspan x={0} dx="0" y={y + i * spacing} key={i}>
              {line}
            </tspan>
          ))}
        </text>
      </g>
    );
  }
}
