import {AppAction} from '../actions/appActions';

export type AppState = {
    isLoading: boolean;
};

export const initialState: AppState = {
    isLoading: true
};

export const appReducer = (state: AppState = initialState, action: AppAction): AppState => {
    switch (action.type) {
        case 'SET_IS_LOADING':
            return {...state, isLoading: action.payload};
        default:
            return state;
    }
};
