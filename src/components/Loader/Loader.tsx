import Backdrop from '@mui/material/Backdrop/Backdrop';
import CircularProgress from '@mui/material/CircularProgress/CircularProgress';
import {useApp} from '../../hooks/useApp';

export const Loader = () => {
    const {isLoading} = useApp();
    return (
        <Backdrop sx={{color: '#fff', zIndex: 1000}} open={isLoading}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};
