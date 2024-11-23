import {Button, Popover, SvgIconTypeMap} from '@mui/material';
import {useCallback, useState} from 'react';
import {OverridableComponent} from '@mui/material/OverridableComponent';
import './styles.css';

type Props = {
    buttonText: string;
    Icon: OverridableComponent<SvgIconTypeMap<object, 'svg'>> & {
        muiName: string;
    };
    Content: () => JSX.Element;
    onClose?: () => void;
    width?: number;
    height?: number;
};

export const ButtonWithPopover = ({buttonText, Icon, Content, onClose, width, height}: Props) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false);

    const handleOpen = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setOpen((open) => !open);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
        setOpen(false);
        onClose?.();
    }, [onClose]);

    return (
        <div className="button-with-popover-container">
            <Button variant="text" onClick={handleOpen} startIcon={<Icon />}>
                {buttonText}
            </Button>
            <Popover
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                onClose={handleClose}
                sx={{
                    width: width || 300,
                    height: height || 500
                }}
                disableScrollLock
            >
                {<Content />}
            </Popover>
        </div>
    );
};
