import React from 'react'
import { Provider } from 'react-redux'
import I18n from 'redux-i18n'
import { BrowserRouter } from 'react-router-dom'
import store from './state'
import Root from './components/Root'
import translations from './translations'

console.info(
  'POST-175 version:',
  import.meta.env.VITE_APP_VERSION,
  import.meta.env.VITE_APP_GIT_TAG,
  import.meta.env.VITE_APP_GIT_BRANCH,
  import.meta.env.VITE_APP_GIT_REVISION,
)

const App = () => (
  <Provider store={store}>
    <I18n translations={translations} initialLang='fr'>
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </I18n>
  </Provider>
)

export default App
