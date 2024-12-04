import {AlertColor} from '@mui/material';
import {AlertAction} from '../actions/alertActions';

export type AlertState = {
    snackBarOpen: boolean;
    snackBarSeverity: AlertColor;
    snackBarMessage: string;
};

export const initialState: AlertState = {
    snackBarOpen: false,
    snackBarSeverity: 'success',
    snackBarMessage: ''
};

export const alertReducer = (state: AlertState = initialState, action: AlertAction): AlertState => {
    switch (action.type) {
        case 'SET_SNACKBAR_OPEN':
            return {...state, snackBarOpen: action.payload};
        case 'SET_SNACKBAR_SEVERITY':
            return {...state, snackBarSeverity: action.payload};
        case 'SET_SNACKBAR_MESSAGE':
            return {...state, snackBarMessage: action.payload};
        default:
            return state;
    }
};
