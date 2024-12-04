import {AlertColor} from '@mui/material/Alert/Alert';

export type AlertAction =
    | {type: 'SET_SNACKBAR_OPEN'; payload: boolean}
    | {type: 'SET_SNACKBAR_SEVERITY'; payload: AlertColor}
    | {type: 'SET_SNACKBAR_MESSAGE'; payload: string};

export const setSnackbarOpen = (payload: boolean): AlertAction => ({
    type: 'SET_SNACKBAR_OPEN',
    payload
});

export const setSnackbarSeverity = (payload: AlertColor): AlertAction => ({
    type: 'SET_SNACKBAR_SEVERITY',
    payload
});

export const setSnackbarMessage = (payload: string): AlertAction => ({
    type: 'SET_SNACKBAR_MESSAGE',
    payload
});
