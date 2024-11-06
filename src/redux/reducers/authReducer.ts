import {AuthAction} from '../actions/authActions';

export type AuthState = {
    isAuthenticated: boolean;
};

export const initialState: AuthState = {
    isAuthenticated: !!localStorage.getItem('token')
};

export const authReducer = (state: AuthState = initialState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'SET_IS_AUTHENTICATED':
            return {...state, isAuthenticated: action.payload};
        default:
            return state;
    }
};
