import { createStore, compose, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootReducer from './reducers'
import rootSaga from './saga'

const preloadedState = undefined
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
