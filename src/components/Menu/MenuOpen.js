import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'

class MenuOpen extends PureComponent {
  render() {
    const { onRequestClose, style } = this.props
    return (
      <div
        style={style}
        className='position-fixed fixed-top fixed-bottom bg-dark w-25 text-light p-3'>

        <button onClick={onRequestClose}>x</button>
        <Link to='/' onClick={onRequestClose}><h1>175 <br /> Joer Post</h1></Link>

        <p>A long history of comunication, technologies, services and people.</p>

        <div>
          <div><Link to='/map' onClick={onRequestClose}>Map</Link></div>
          <div><Link to='/timeline' onClick={onRequestClose}>Timeline</Link></div>
          <div><Link to='/about' onClick={onRequestClose}>About</Link></div>
        </div>
      </div>
    )
  }
}

export default MenuOpen
