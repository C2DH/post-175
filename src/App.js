import React from 'react'
import { Provider } from 'react-redux'
import I18n from 'redux-i18n'
import { BrowserRouter as Router } from 'react-router-dom'
import store from './state'
import Root from './components/Root'
import translations from './translations'

const App = () => (
  <Provider store={store}>
    <I18n translations={translations} initialLang='fr'>
      <Router>
        <Root />
      </Router>
    </I18n>
  </Provider>
)

export default App
