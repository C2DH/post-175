import { createStore, compose, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootReducer from './reducers'
import rootSaga from './saga'

const preloadedState = {
  lang: {
    // All available langs
    list: [
      {
        // code: The miller swag code
        code: 'de_DE',
        // param: Used to match in location
        param: 'de',
        // label: Beautiful UI display
        label: 'DE',
      },
      {
        code: 'fr_FR',
        param: 'fr',
        label: 'FR',
      },
    ],
    // Default selected lang code
    selected: 'de_DE',
  }
}
const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  rootReducer,
  preloadedState,
  compose(
    applyMiddleware(sagaMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
)
sagaMiddleware.run(rootSaga)

export default store
