import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { AnimatedRoute } from 'react-router-transition'
import store from './state'

import Home from './pages/Home'
import MapPage from './pages/MapPage'
import Timeline from './pages/Timeline'
import About from './pages/About'

const App = () => (
  <Provider store={store}>
    <Router>
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
    </Router>
  </Provider>
)

export default App
