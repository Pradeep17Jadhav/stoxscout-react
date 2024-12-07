import Alert from '@mui/material/Alert/Alert';
import Snackbar from '@mui/material/Snackbar/Snackbar';
import {useAlert} from '../../hooks/useAlert';

export const SnackBar = () => {
    const {snackBarMessage, snackBarSeverity, snackBarOpen, closeSnackBar} = useAlert();

    return (
        <Snackbar
            open={snackBarOpen}
            autoHideDuration={10000}
            onClose={closeSnackBar}
            anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        >
            <Alert onClose={closeSnackBar} severity={snackBarSeverity} variant="filled" sx={{width: '100%'}}>
                {snackBarMessage}
            </Alert>
        </Snackbar>
    );
};
