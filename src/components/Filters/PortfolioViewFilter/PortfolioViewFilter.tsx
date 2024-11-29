import Box from '@mui/material/Box/Box';
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import Radio from '@mui/material/Radio/Radio';
import RadioGroup from '@mui/material/RadioGroup/RadioGroup';
import {useCallback} from 'react';
import {PORTFOLIO_VIEW, PORTFOLIO_VIEW_NAMES} from '../../../types/portfolio';

type Props = {
    currentView: PORTFOLIO_VIEW;
    onCurrentViewChange: (view: PORTFOLIO_VIEW) => void;
    handlePopoverClose?: () => void;
};

const PortfolioViewFilter = ({currentView, onCurrentViewChange, handlePopoverClose}: Props) => {
    const onPortfolioViewChange = useCallback(
        (view: PORTFOLIO_VIEW) => () => {
            onCurrentViewChange?.(view);
            handlePopoverClose?.();
        },
        [onCurrentViewChange, handlePopoverClose]
    );

    return (
        <Box p={2} overflow="auto">
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
            >
                {Object.entries(PORTFOLIO_VIEW_NAMES).map(([key, view]) => {
                    return (
                        <FormControlLabel
                            key={view}
                            sx={{minWidth: '200px'}}
                            control={
                                <Radio
                                    checked={PORTFOLIO_VIEW_NAMES[currentView] === view}
                                    onChange={onPortfolioViewChange(parseInt(key) as PORTFOLIO_VIEW)}
                                    color="primary"
                                />
                            }
                            label={view}
                        />
                    );
                })}
            </RadioGroup>
        </Box>
    );
};

export default PortfolioViewFilter;
