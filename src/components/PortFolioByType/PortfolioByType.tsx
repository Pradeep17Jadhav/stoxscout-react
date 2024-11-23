import FilterListIcon from '@mui/icons-material/FilterList';
import TodayIcon from '@mui/icons-material/Today';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {ButtonWithPopover} from '../Buttons/ButtonWithPopover/ButtonWithPopover';
import {useApp} from '../../hooks/useApp';
import {useCallback, useMemo, useState} from 'react';
import Box from '@mui/material/Box/Box';
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import {Radio, RadioGroup} from '@mui/material';
import {PortfolioByDate} from '../PortfolioByDate/PortfolioByDate';
import {PortfolioByMonth} from '../PortfolioByMonth/PortfolioByMonth';
import {PortfolioByYear} from '../PortFolioByYear/PortfolioByYear';
import {Portfolio} from '../../pages/Portfolio/Portfolio';
import ColumnFilter from '../ColumnFilter/ColumnFilter';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../redux/store/store';
import usePreferences from '../../hooks/usePreferences';
import './styles.css';

enum PORTFOLIO_VIEW {
    FULL = 1,
    BY_DATE = 2,
    BY_MONTH = 3,
    BY_YEAR = 4
}

export const PORTFOLIO_VIEW_NAMES = {
    [PORTFOLIO_VIEW.FULL]: 'Full',
    [PORTFOLIO_VIEW.BY_DATE]: 'By Date',
    [PORTFOLIO_VIEW.BY_MONTH]: 'By Month',
    [PORTFOLIO_VIEW.BY_YEAR]: 'By Year'
};

export const PortfolioByType = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {isLoading} = useApp();
    const {updatePreferencesOnline} = usePreferences();
    const [currentView, setCurrentView] = useState<PORTFOLIO_VIEW>(PORTFOLIO_VIEW.BY_DATE);

    const handleRadioChange = useCallback(
        (view: PORTFOLIO_VIEW) => () => {
            setCurrentView(view);
        },
        []
    );

    const onFilterPopoverClose = useCallback(() => {
        dispatch(updatePreferencesOnline());
    }, [dispatch, updatePreferencesOnline]);

    const getFilterContent = useCallback(
        () => (
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
                                sx={{minWidth: '240px'}}
                                control={
                                    <Radio
                                        checked={PORTFOLIO_VIEW_NAMES[currentView] === view}
                                        onChange={handleRadioChange(parseInt(key) as PORTFOLIO_VIEW)}
                                        color="primary"
                                    />
                                }
                                label={view}
                            />
                        );
                    })}
                </RadioGroup>
            </Box>
        ),
        [currentView, handleRadioChange]
    );

    const viewBySelection = useMemo(() => {
        if (currentView === PORTFOLIO_VIEW.BY_DATE) {
            return <PortfolioByDate />;
        } else if (currentView === PORTFOLIO_VIEW.BY_MONTH) {
            return <PortfolioByMonth />;
        } else if (currentView === PORTFOLIO_VIEW.BY_YEAR) {
            return <PortfolioByYear />;
        } else {
            return <Portfolio />;
        }
    }, [currentView]);

    const getCalenderIcon = useMemo(() => {
        if (currentView === PORTFOLIO_VIEW.BY_YEAR) {
            return CalendarMonthIcon;
        } else if (currentView === PORTFOLIO_VIEW.BY_DATE) {
            return CalendarTodayIcon;
        }
        return TodayIcon;
    }, [currentView]);

    return !isLoading ? (
        <>
            <div className="menu-items">
                <ButtonWithPopover
                    buttonText={`Viewing investments ${PORTFOLIO_VIEW_NAMES[currentView]}`}
                    Icon={getCalenderIcon}
                    Content={getFilterContent}
                />
                <ButtonWithPopover
                    buttonText="Filter"
                    Icon={FilterListIcon}
                    Content={ColumnFilter}
                    onClose={onFilterPopoverClose}
                />
            </div>
            {viewBySelection}
        </>
    ) : (
        <></>
    );
};
