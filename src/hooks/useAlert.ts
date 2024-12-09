import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AlertColor} from '@mui/material/Alert/Alert';
import {RootState} from '../redux/reducers/rootReducer';
import {AlertState} from '../redux/reducers/alertReducer';
import {
    setFetching,
    setProcessSuccess,
    setSnackbarMessage,
    setSnackbarOpen,
    setSnackbarSeverity
} from '../redux/actions/alertActions';

type UseAlertType = {
    snackBarMessage: string;
    snackBarSeverity: AlertColor;
    snackBarOpen: boolean;
    isFetching: boolean;
    isProcessSuccess: boolean;
    showSnackBar: (message: string, severity?: AlertColor) => void;
    closeSnackBar: () => void;
    showLinearProcess: () => void;
    hideLinearProcess: (success?: boolean) => void;
};

export const useAlert = (): UseAlertType => {
    const dispatch = useDispatch();
    const state: AlertState = useSelector((state: RootState) => state.alert);

    const showLinearProcess = useCallback(() => {
        dispatch(setFetching(true));
    }, [dispatch]);

    const hideLinearProcess = useCallback(
        (isProcessSuccess = true) => {
            dispatch(setFetching(false));
            dispatch(setProcessSuccess(isProcessSuccess));
        },
        [dispatch]
    );

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
        isFetching: state.linearProcess,
        isProcessSuccess: state.linearProcessSuccess,
        showSnackBar,
        closeSnackBar,
        showLinearProcess,
        hideLinearProcess
    };
};
