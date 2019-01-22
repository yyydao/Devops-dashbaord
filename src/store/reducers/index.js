import { combineReducers } from 'redux';
import auth from './auth';
import project from './project';
import pipeline from './pipeline';
import menu from './menu';

const rootReducer = combineReducers({
  auth,
  project,
  pipeline,
  menu
});

export default rootReducer;
