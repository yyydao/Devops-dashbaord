import reducer from './system/reducer'
import {createStore,  applyMiddleware} from "redux";
import { combineReducers } from "redux-immutable";
import thunkMiddleware from "redux-thunk";



let store = createStore(
  combineReducers({system:reducer}),
  applyMiddleware(thunkMiddleware)
);

export default store;