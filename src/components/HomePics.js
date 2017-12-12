import React from 'react'
import ReactDOM from 'react-dom'
import { range } from 'lodash'
import { Motion, spring } from 'react-motion'
import { scaleLinear } from 'd3-scale'
const NUM_PICS = 50

export default class HomePics extends React.PureComponent {

  state = {
    width: 0,
    x: null,
  }

  componentDidMount(){
    const node = ReactDOM.findDOMNode(this)
    const width = node.offsetWidth
    this.setState({width})
  }

  flexScale = scaleLinear().range([0.5, 2, 20]).domain([25, 5, 0])


  getColor = (i) => {
    const itemWidth = Math.round(255.0 / NUM_PICS)
    const col = itemWidth * i
    return `rgb(${col}, ${col}, ${col})`
  }

  getImage = (i) => {
    return `url(https://picsum.photos/200/700/?random&ts=${i})`
  }

  handleMouseMove = (e) => {
    console.log(e.clientX)
    const { width } = this.state
    const itemWidth = width ? width / NUM_PICS : 0
    console.log(e.clientX / itemWidth)
    const index = Math.round(e.clientX / itemWidth)
    this.setState({x: e.clientX / itemWidth})

  }

  handleMouseOut = (e) => {
    this.setState({x: null})
  }


  render(){

    const { width, x } = this.state
    const itemWidth = width ? width / NUM_PICS : 0

    return (<div className="w-100 h-100 d-flex flex-row"
        onMouseOut={this.handleMouseOut}
        onMouseMove={this.handleMouseMove}>
      {itemWidth > 0 && range(NUM_PICS).map(i =>{
        const flex = x ? this.flexScale(Math.abs(x - i)) : 1
        return ( <Motion key={i} defaultStyle={{flex:1}} style={{flex:spring(flex)}}>
          {({flex}) => (
            <div className="h-100"
              style={{
                flex,
                // background:this.getColor(i),
                backgroundImage:this.getImage(i),
                backgroundSize: 'cover',

              }}>
            </div>
          )}
        </Motion>
        )
      })}

    </div>)


  }
}
