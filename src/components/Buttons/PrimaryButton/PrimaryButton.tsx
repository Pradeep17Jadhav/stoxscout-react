import {Button} from '@mui/material';
import classnames from 'classnames';
import './styles.css';

type Props = {
    children: string;
    disabled: boolean;
    className: string;
    onClick?: () => void;
    type?: 'submit' | 'button' | 'reset';
};

export const PrimaryButton = ({children, disabled, type, className, onClick}: Props) => {
    return (
        <Button
            className={classnames('primary-button', className)}
            type={type}
            variant="contained"
            color="primary"
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </Button>
    );
};
