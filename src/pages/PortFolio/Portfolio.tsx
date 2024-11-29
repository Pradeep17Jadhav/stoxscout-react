import {useCallback, useMemo, useState} from 'react';
import {useDispatch} from 'react-redux';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FilterListIcon from '@mui/icons-material/FilterList';
import TodayIcon from '@mui/icons-material/Today';
import {ButtonWithPopover} from '../../components/Buttons/ButtonWithPopover/ButtonWithPopover';
import {PortfolioByDate} from '../../components/PortfolioByDate/PortfolioByDate';
import {PortfolioByMonth} from '../../components/PortfolioByMonth/PortfolioByMonth';
import {PortfolioByYear} from '../../components/PortFolioByYear/PortfolioByYear';
import {PortfolioFull} from '../../components/PortfolioFull/PortfolioFull';
import ColumnFilter from '../../components/Filters/ColumnFilter/ColumnFilter';
import PortfolioViewFilter from '../../components/Filters/PortfolioViewFilter/PortfolioViewFilter';
import {AppDispatch} from '../../redux/store/store';
import usePreferences from '../../hooks/usePreferences';
import {useApp} from '../../hooks/useApp';
import './styles.css';
import {PORTFOLIO_VIEW, PORTFOLIO_VIEW_NAMES} from '../../types/portfolio';

export const Portfolio = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {isLoading} = useApp();
    const {updatePreferencesOnline} = usePreferences();
    const [currentView, setCurrentView] = useState<PORTFOLIO_VIEW>(PORTFOLIO_VIEW.FULL);

    const onFilterPopoverClose = useCallback(() => {
        dispatch(updatePreferencesOnline());
    }, [dispatch, updatePreferencesOnline]);

    const handleCurrentViewChange = useCallback((view: PORTFOLIO_VIEW) => {
        setCurrentView(view);
    }, []);

    const viewBySelection = useMemo(() => {
        if (currentView === PORTFOLIO_VIEW.BY_DATE) {
            return <PortfolioByDate />;
        } else if (currentView === PORTFOLIO_VIEW.BY_MONTH) {
            return <PortfolioByMonth />;
        } else if (currentView === PORTFOLIO_VIEW.BY_YEAR) {
            return <PortfolioByYear />;
        } else {
            return <PortfolioFull />;
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
                    width={240}
                >
                    <PortfolioViewFilter onCurrentViewChange={handleCurrentViewChange} currentView={currentView} />
                </ButtonWithPopover>
                <ButtonWithPopover buttonText="Filter" Icon={FilterListIcon} onClose={onFilterPopoverClose}>
                    <ColumnFilter />
                </ButtonWithPopover>
            </div>
            {viewBySelection}
        </>
    ) : (
        <></>
    );
};
