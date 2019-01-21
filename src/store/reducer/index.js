import { combineReducers } from 'redux';
import login from './login';
import project from './project';
import pipeline from './pipeline';
import menu from './menu';

const rootReducer = combineReducers({
  login,
  project,
  pipeline,
  menu
});

export default rootReducer;
