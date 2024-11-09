import {combineReducers} from 'redux';
import {portfolioReducer} from './portfolioReducer';
import {userReducer} from './userReducer';
import {authReducer} from './authReducer';
import {appReducer} from './appReducer';

const rootReducer = combineReducers({
    app: appReducer,
    portfolio: portfolioReducer,
    user: userReducer,
    auth: authReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
