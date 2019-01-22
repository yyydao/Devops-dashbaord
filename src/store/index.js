import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { logger } from 'redux-logger'
import promiseMiddleware from 'redux-promise-middleware'
import reducers from './reducers'

import { composeWithDevTools } from 'redux-devtools-extension'

export default function configureStore (preloadedState) {
  const middlewares = [promiseMiddleware({ promiseTypeSuffixes: ['PENDING', 'SUCCESS', 'ERROR'] }), thunkMiddleware]
  const middlewareEnhancer = applyMiddleware(...middlewares, logger)
  const enhancers = [middlewareEnhancer]
  const composedEnhancers = composeWithDevTools(...enhancers)

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(reducers))
  }
  const store = createStore(reducers, preloadedState, composedEnhancers)

  return store
}
