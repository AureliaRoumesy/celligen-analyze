import { combineReducers } from 'redux';
import manipListReducer from './manipListReducer';
import tokenReducer from './tokenReducer';

const rootReducer = combineReducers({
  manipList: manipListReducer,
  token: tokenReducer,
});

export default rootReducer;
