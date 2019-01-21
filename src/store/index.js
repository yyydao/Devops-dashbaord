import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducer'

import { composeWithDevTools } from 'redux-devtools-extension'

let store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk))
)

export default store
