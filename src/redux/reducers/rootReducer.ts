import {combineReducers} from 'redux';
import {portfolioReducer} from './portfolioReducer';
import {userReducer} from './userReducer';

const rootReducer = combineReducers({
    portfolio: portfolioReducer,
    user: userReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
