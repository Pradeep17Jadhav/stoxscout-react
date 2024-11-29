import {Button, Popover, SvgIconTypeMap} from '@mui/material';
import {cloneElement, ReactElement, useCallback, useState} from 'react';
import {OverridableComponent} from '@mui/material/OverridableComponent';
import './styles.css';

type Props = {
    children: ReactElement;
    buttonText: string;
    Icon: OverridableComponent<SvgIconTypeMap<object, 'svg'>> & {
        muiName: string;
    };
    onClose?: () => void;
    width?: number;
    height?: number;
};

export const ButtonWithPopover = ({children, buttonText, Icon, onClose, width, height}: Props) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false);

    const handleOpen = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setOpen((open) => !open);
    }, []);

    const handlePopoverClose = useCallback(() => {
        setAnchorEl(null);
        setOpen(false);
        onClose?.();
    }, [onClose]);

    return (
        <span className="button-with-popover-container">
            <Button variant="text" onClick={handleOpen} startIcon={<Icon />}>
                {buttonText}
            </Button>
            <Popover
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                onClose={handlePopoverClose}
                sx={{
                    width: width || 300,
                    height: height || 500
                }}
                disableScrollLock
            >
                {cloneElement(children, {handlePopoverClose})}
            </Popover>
        </span>
    );
};
