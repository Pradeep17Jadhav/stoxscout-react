import {AlertColor} from '@mui/material';
import {AlertAction} from '../actions/alertActions';

export type AlertState = {
    snackBarOpen: boolean;
    snackBarSeverity: AlertColor;
    snackBarMessage: string;
    linearProcess: boolean;
    linearProcessSuccess: boolean;
};

export const initialState: AlertState = {
    snackBarOpen: false,
    snackBarSeverity: 'success',
    snackBarMessage: '',
    linearProcess: false,
    linearProcessSuccess: true
};

export const alertReducer = (state: AlertState = initialState, action: AlertAction): AlertState => {
    switch (action.type) {
        case 'SET_SNACKBAR_OPEN':
            return {...state, snackBarOpen: action.payload};
        case 'SET_SNACKBAR_SEVERITY':
            return {...state, snackBarSeverity: action.payload};
        case 'SET_SNACKBAR_MESSAGE':
            return {...state, snackBarMessage: action.payload};
        case 'SET_FETCHING':
            return {...state, linearProcess: action.payload};
        case 'SET_PROCESS_SUCCESS':
            return {...state, linearProcessSuccess: action.payload};
        default:
            return state;
    }
};
