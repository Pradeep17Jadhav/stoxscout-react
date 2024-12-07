import {ReactNode, useCallback} from 'react';
import Button from '@mui/material/Button/Button';
import Dialog from '@mui/material/Dialog/Dialog';
import DialogActions from '@mui/material/DialogActions/DialogActions';
import DialogContent from '@mui/material/DialogContent/DialogContent';
import DialogContentText from '@mui/material/DialogContentText/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress/LinearProgress';
import './styles.css';

type Props = {
    children?: ReactNode;
    open: boolean;
    title: string;
    textBefore?: string;
    textAfter?: string;
    leftbuttonText?: string;
    rightButtonText?: string;
    rightButtonDisabled?: boolean;
    leftButtonDisabled?: boolean;
    hideButtons?: boolean;
    loading?: boolean;
    setOpen: (open: boolean) => void;
    onLeftButtonClick?: () => void;
    onRightButtonClick?: () => void;
};

const MagnyFireDialog = ({
    children,
    open,
    title,
    textBefore,
    textAfter,
    leftbuttonText,
    rightButtonText,
    rightButtonDisabled,
    leftButtonDisabled,
    hideButtons,
    loading,
    setOpen,
    onLeftButtonClick,
    onRightButtonClick
}: Props) => {
    const handleClose = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const handleLeftButtonClick = useCallback(() => {
        handleClose();
        onLeftButtonClick?.();
    }, [handleClose, onLeftButtonClick]);

    const handleRightButtonClick = useCallback(() => {
        onRightButtonClick?.();
    }, [onRightButtonClick]);

    return (
        <Dialog className="dialog" open={open} fullWidth={true} maxWidth={'md'}>
            <DialogTitle>{title}</DialogTitle>
            <div className="linear-process-container">{loading && <LinearProgress />}</div>
            <DialogContent>
                <DialogContentText>
                    {textBefore}
                    {children}
                    {textAfter}
                </DialogContentText>
            </DialogContent>
            {!hideButtons && (
                <DialogActions>
                    <Button onClick={handleLeftButtonClick} disabled={leftButtonDisabled}>
                        {leftbuttonText || 'Cancel'}
                    </Button>
                    <Button onClick={handleRightButtonClick} disabled={rightButtonDisabled} autoFocus>
                        {rightButtonText || 'Ok'}
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
};

export default MagnyFireDialog;
