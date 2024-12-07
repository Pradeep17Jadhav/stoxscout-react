import {ReactNode, useCallback} from 'react';
import Button from '@mui/material/Button/Button';
import Dialog from '@mui/material/Dialog/Dialog';
import DialogActions from '@mui/material/DialogActions/DialogActions';
import DialogContent from '@mui/material/DialogContent/DialogContent';
import DialogContentText from '@mui/material/DialogContentText/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle/DialogTitle';
import './styles.css';

type Props = {
    children?: ReactNode;
    open: boolean;
    title: string;
    textBefore?: string;
    textAfter?: string;
    leftbuttonText?: string;
    rightButtonText?: string;
    hideButtons?: boolean;
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
    hideButtons,
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
        handleClose();
        onRightButtonClick?.();
    }, [handleClose, onRightButtonClick]);

    return (
        <Dialog className="dialog" open={open} fullWidth={true} maxWidth={'md'}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {textBefore}
                    {children}
                    {textAfter}
                </DialogContentText>
            </DialogContent>
            {!hideButtons && (
                <DialogActions>
                    <Button onClick={handleLeftButtonClick}>{leftbuttonText || 'Cancel'}</Button>
                    <Button onClick={handleRightButtonClick} autoFocus>
                        {rightButtonText || 'Ok'}
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
};

export default MagnyFireDialog;
