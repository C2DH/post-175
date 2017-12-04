import React, { PureComponent } from 'react'

const years = ['1810', '1820', '1830', '1840', '1850', '1860', '1870', '1880', '1890', '1900', '1910', '1920', '1930']

class TimelineNavigation extends PureComponent {
  render() {
    return (
      <div className="align-self-end bg-dark w-100 d-flex flex-column" style={{height:100}}>
        <div className="d-inline-flex flex-1 w-100">
          {years.map((year, i)=> (
            <span key={i} className="text-light ml-3 mr-3">.</span>
          ))}
        </div>
        <div className="d-inline-flex flex-1 w-100">
          {years.map((year, i)=> (
            <span key={i} className="text-light ml-3 mr-3">{year}</span>
          ))}
        </div>
      </div>
    )
  }
}

export default TimelineNavigation
