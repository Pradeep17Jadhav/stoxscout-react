import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AlertColor} from '@mui/material/Alert/Alert';
import {RootState} from '../redux/reducers/rootReducer';
import {AlertState} from '../redux/reducers/alertReducer';
import {setSnackbarMessage, setSnackbarOpen, setSnackbarSeverity} from '../redux/actions/alertActions';

type UseAlertType = {
    snackBarMessage: string;
    snackBarSeverity: AlertColor;
    snackBarOpen: boolean;
    showSnackBar: (message: string, severity?: AlertColor) => void;
    closeSnackBar: () => void;
};

export const useAlert = (): UseAlertType => {
    const dispatch = useDispatch();
    const state: AlertState = useSelector((state: RootState) => state.alert);

    const showSnackBar = useCallback(
        (message: string, severity: AlertColor = 'success') => {
            dispatch(setSnackbarMessage(message));
            dispatch(setSnackbarSeverity(severity));
            dispatch(setSnackbarOpen(true));
        },
        [dispatch]
    );

    const closeSnackBar = useCallback(() => {
        dispatch(setSnackbarOpen(false));
    }, [dispatch]);

    return {
        snackBarMessage: state.snackBarMessage,
        snackBarSeverity: state.snackBarSeverity,
        snackBarOpen: state.snackBarOpen,
        showSnackBar,
        closeSnackBar
    };
};
