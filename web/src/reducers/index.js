import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import market from './market';
import account from './account';
import config from './config';

const rootReducer = combineReducers({ market, account, config, form: !!formReducer ? formReducer : {} });
export default rootReducer;
