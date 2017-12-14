import React from 'react'
import ReactDOM from 'react-dom'
import { range, sumBy, sum, max } from 'lodash'
import { StaggeredMotion, Motion, spring } from 'react-motion'
import { scaleLinear } from 'd3-scale'
const NUM_PICS = 50

export default class HomePics extends React.PureComponent {

  state = {
    width: 0,
    x: null,
    flexs: range(NUM_PICS).map(()=>1),
  }

  componentDidMount(){
    const node = ReactDOM.findDOMNode(this)
    const width = node.offsetWidth
    this.setState({width})
  }

  flexScale = scaleLinear().range([NUM_PICS/100, NUM_PICS/10, NUM_PICS])


  getColor = (i) => {
    const itemWidth = Math.round(255.0 / NUM_PICS)
    const col = itemWidth * i
    return `rgb(${col}, ${col}, ${col})`
  }

  getImage = (i) => {
    return `url(https://picsum.photos/200/700/?random&ts=${i})`
  }

  handleMouseMove = (e) => {
    // console.log(e.clientX)
    const { width, flexs } = this.state
    const itemWidth = width ? width / NUM_PICS : 0
    // console.log(e.clientX / itemWidth)
    const index = Math.round(e.clientX / itemWidth)

    const totalFlex = sum(flexs)
    const maxFlex = max(flexs)

    // this.setState({x: e.clientX / itemWidth})
    const flexUnitWidth = (width / totalFlex)

    const positions = flexs.reduce((acc, item, i)=>{
      const currentWidth = flexUnitWidth * item
      return {
        lastWidth: acc.lastWidth + currentWidth,
        p: acc.p.concat(acc.lastWidth + currentWidth / 2)
      }

    }, {lastWidth:0, p:[]})


    this.flexScale.domain([width, maxFlex*flexUnitWidth, 0])

    const newFlexs = positions.p.map(pos => this.flexScale(Math.abs(e.clientX - pos ).toFixed(1)))
    this.setState({flexs:newFlexs})

    // const positions = prevInterpolatedStyles.reduce((acc, item, i)=>{
    //   const w = i === 0 ? 0 : acc[i-1]
    //   return acc.concat(w + flexUnitWidth * item.f)
    // }, [])




  }

  handleMouseOut = (e) => {
    this.setState({x: null})
  }

  getStyles = prevInterpolatedStyles => {

    const { width, x } = this.state
    const itemWidth = width ? width / NUM_PICS : 0
    const flexo = (i, positions) => x ? this.flexScale(Math.abs(x - (positions[i] / itemWidth).toFixed(2))) : 1

    const totalFlex = sumBy(prevInterpolatedStyles, item => item.f)
    const flexUnitWidth = (width / totalFlex).toFixed(2)
    const positions = prevInterpolatedStyles.reduce((acc, item, i)=>{
      const w = i === 0 ? 0 : acc[i-1]
      return acc.concat(w + flexUnitWidth * item.f)
    }, [])

    console.log("prevInterpolatedStyles", prevInterpolatedStyles, totalFlex)
    return  prevInterpolatedStyles.map(
      (_, i) => { return ({f: spring(flexo(i, positions))})}
    )
  }

  render() {

    const { docs } = this.props
    const { width, x, flexs } = this.state

    const itemWidth = width ? width / NUM_PICS : 0
    // Bender Brother
    const flexo = (i, previousFlexs) => x ? this.flexScale(Math.abs(x - i)) : 1

    // return (
    //   <StaggeredMotion
    //     defaultStyles={docs.map((_, i) => ({ f: flexo(i) }))}
    //     styles={this.getStyles}>
    //     {interpolatingStyles =>
    //       <div className="w-100 h-100 d-flex flex-row"
    //           onMouseOut={this.handleMouseOut}
    //           onMouseMove={this.handleMouseMove}>
    //         {interpolatingStyles.map((style, i) =>
    //           <div className="h-100"
    //             key={i}
    //             style={{
    //               flex: style.f,
    //               backgroundImage: `url(${docs[i].snapshot})`,
    //               backgroundSize: 'cover',
    //
    //             }}/>
    //         )}
    //       </div>
    //     }
    //   </StaggeredMotion>
    // )

    return (<div className="w-100 h-100 d-flex flex-row"
        onMouseOut={this.handleMouseOut}
        onMouseMove={this.handleMouseMove}>
      {itemWidth > 0 && flexs.map((flex, i) =>{
        // const flex = x ? this.flexScale(Math.abs(x - i)) : 1
        return (
          // <Motion key={i} defaultStyle={{flex:1}} style={{flex:spring(flex)}}>
          // {({flex}) => (
            <div key={i} className="h-100"
              style={{
                flex,
                // background:this.getColor(i),
                backgroundImage:this.getImage(i),
                backgroundSize: 'cover',
                backgroundPosition: 'center center',

              }}>
            </div>
        //   )}
        // </Motion>
        )
      })}

    </div>)


  }
}
