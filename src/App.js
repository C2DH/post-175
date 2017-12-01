import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import store from './state'
import Root from './Root'

const App = () => (
  <Provider store={store}>
    <Router>
      <Root />
    </Router>
  </Provider>
)

export default App
