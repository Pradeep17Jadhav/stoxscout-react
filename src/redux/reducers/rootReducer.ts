import {combineReducers} from 'redux';
import {portfolioReducer} from './portfolioReducer';
import {userReducer} from './userReducer';
import {authReducer} from './authReducer';

const rootReducer = combineReducers({
    portfolio: portfolioReducer,
    user: userReducer,
    auth: authReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
