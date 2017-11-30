import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
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
        <Route path='/about' exact component={About} />
      </Switch>
    </Router>
  </Provider>
)

export default App
