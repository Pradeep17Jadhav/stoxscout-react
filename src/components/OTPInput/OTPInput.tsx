import React, {useEffect, useRef} from 'react';
import {Box, styled} from '@mui/material';
import {Input as BaseInput} from '@mui/base/Input';
import './styles.css';
const blue = {
    100: '#DAECFF',
    200: '#80BFFF',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    700: '#0059B2'
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025'
};

const InputElement = styled('input')(
    ({theme}) => `
  width: 40px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 0;
  border-radius: 8px;
  text-align: center;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0 2px 4px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'};

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  /* firefox */
  &:focus-visible {
    outline: 0;
  }
`
);

interface Props {
    length: number;
    value: string;
    onChange: React.Dispatch<React.SetStateAction<string>>;
    onlyNumber: boolean;
}

const OTPInput = ({length, value, onChange, onlyNumber}: Props) => {
    const inputRefs = useRef<HTMLInputElement[]>(new Array(length).fill(null));

    useEffect(() => {
        focusInput(0);
    }, []);

    useEffect(() => {
        if (value === '') {
            focusInput(0);
        }
    }, [value]);

    const focusInput = (targetIndex: number) => {
        inputRefs.current[targetIndex]?.focus();
    };

    const selectInput = (targetIndex: number) => {
        inputRefs.current[targetIndex]?.select();
    };

    const handleKeyDown = (event: any, currentIndex: number) => {
        switch (event.key) {
            case 'ArrowUp':
            case 'ArrowDown':
            case ' ':
                event.preventDefault();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                if (currentIndex > 0) {
                    focusInput(currentIndex - 1);
                    selectInput(currentIndex - 1);
                }
                break;
            case 'ArrowRight':
                event.preventDefault();
                if (currentIndex < length - 1) {
                    focusInput(currentIndex + 1);
                    selectInput(currentIndex + 1);
                }
                break;
            case 'Delete':
            case 'Backspace':
                event.preventDefault();
                onChange((prev) => {
                    const otpArray = prev.split('');
                    otpArray.splice(currentIndex, 1);
                    return otpArray.join('');
                });
                if (event.key === 'Backspace' && currentIndex > 0) {
                    focusInput(currentIndex - 1);
                    selectInput(currentIndex - 1);
                }
                break;
            default:
                break;
        }
    };

    const handleChange = (event: any, currentIndex: number) => {
        const currentValue = event.target.value;
        const parsedValue = parseInt(currentValue, 10);
        if (onlyNumber && (isNaN(parsedValue) || parsedValue < 0 || parsedValue > 9)) {
            return;
        }
        onChange((prev) => {
            const otpArray = prev.split('');
            otpArray[currentIndex] = currentValue.slice(-1) || '';
            return otpArray.join('');
        });
        if (currentValue && currentIndex < length - 1) {
            focusInput(value.length + 1);
        }
    };

    const handleClick = (_: any, currentIndex: number) => {
        selectInput(currentIndex);
    };

    const handlePaste = (event: any, currentIndex: number) => {
        event.preventDefault();
        const pastedText = event.clipboardData.getData('text/plain').slice(0, length - currentIndex);
        onChange((prev) => {
            const otpArray = prev.split('');
            for (let i = 0; i < pastedText.length; i++) {
                if (currentIndex + i < length) {
                    otpArray[currentIndex + i] = pastedText[i];
                }
            }
            return otpArray.join('');
        });
    };

    return (
        <Box className="otp-container">
            {Array.from({length}).map((_, index) => (
                <React.Fragment key={index}>
                    <BaseInput
                        className="otp-input"
                        slots={{
                            input: InputElement
                        }}
                        aria-label={`Digit ${index + 1} of OTP`}
                        slotProps={{
                            input: {
                                ref: (ele) => {
                                    inputRefs.current[index] = ele!;
                                },
                                onKeyDown: (event) => handleKeyDown(event, index),
                                onChange: (event) => handleChange(event, index),
                                onClick: (event) => handleClick(event, index),
                                onPaste: (event) => handlePaste(event, index),
                                value: value[index] || ''
                            }
                        }}
                    />
                </React.Fragment>
            ))}
        </Box>
    );
};

export default OTPInput;
