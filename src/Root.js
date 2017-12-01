import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { AnimatedRoute } from 'react-router-transition'

import Menu from './components/Menu'
import Home from './pages/Home'
import MapPage from './pages/MapPage'
import Timeline from './pages/Timeline'
import About from './pages/About'

const Root = () => (
  <div>
    <Menu />
    <Switch>
      <Route path='/' exact component={Home} />
      <Route path='/map' exact component={MapPage} />
      <Route path='/timeline' exact component={Timeline} />
      <AnimatedRoute
        path='/about'
        exact
        component={About}
        atEnter={{ opacity: 0 }}
        atLeave={{ opacity: 0 }}
        atActive={{ opacity: 1 }}
        mapStyles={(styles) => ({  opacity: styles.opacity })}
      />
    </Switch>
  </div>
)

export default Root
