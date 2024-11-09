import {useCallback, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import FilterListIcon from '@mui/icons-material/FilterList';
import {sort} from '../../helpers/sort';
import {SORT_ORDER, StockInformation} from '../../types/transaction';
import {HoldingTable} from '../HoldingTable/HoldingTable';
import {HoldingInformation} from '../HoldingInformation/HoldingInformation';
import {usePortfolio} from '../../hooks/usePortfolio';
import {useUser} from '../../hooks/useUser';
import {DashboardPreferences, DEFAULT_COLUMNS} from '../../types/userPreferences';
import usePreferences from '../../hooks/usePreferences';
import {ButtonWithPopover} from '../ButtonWithPopover/ButtonWithPopover';
import ColumnFilter from '../ColumnFilter/ColumnFilter';
import {AppDispatch} from '../../redux/store/store';
import {useApp} from '../../hooks/useApp';

import './styles.css';

export const Portfolio = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {stocksInfo} = usePortfolio();
    const {holdingSummary, preferences} = useUser();
    const {dashboardPreferences, updateDashboardPreferences, updatePreferencesOnline} = usePreferences();
    const [sortedStockInfo, setSortedStockInfo] = useState<StockInformation[]>(stocksInfo);
    const {isLoading} = useApp();

    const onSort = useCallback(
        (column: DEFAULT_COLUMNS, order: SORT_ORDER) => {
            if (!stocksInfo?.length) {
                return;
            }
            if (column !== dashboardPreferences?.sortColumn || order !== dashboardPreferences?.sortOrder) {
                const newDashboardPreference: DashboardPreferences = {
                    ...dashboardPreferences,
                    sortColumn: column,
                    sortOrder: order
                };
                dispatch(updateDashboardPreferences(newDashboardPreference));
            }
            const sortedStocksInfo = sort(stocksInfo, column, order);
            setSortedStockInfo(sortedStocksInfo);
        },
        [dashboardPreferences, stocksInfo, dispatch, updateDashboardPreferences]
    );

    const onFilterPopoverClose = useCallback(() => {
        dispatch(updatePreferencesOnline());
    }, [dispatch, updatePreferencesOnline]);

    useEffect(() => {
        const prefColumn = dashboardPreferences?.sortColumn;
        const prefSortOrder = dashboardPreferences?.sortOrder;
        if (prefColumn && prefSortOrder) {
            onSort(prefColumn, prefSortOrder);
        }
    }, [stocksInfo, preferences, dashboardPreferences?.sortColumn, dashboardPreferences?.sortOrder, onSort]);

    return !isLoading ? (
        <>
            <div className="menu-items">
                <ButtonWithPopover
                    buttonText="Filter"
                    Icon={FilterListIcon}
                    Content={ColumnFilter}
                    onClose={onFilterPopoverClose}
                />
            </div>
            <HoldingTable
                stocksInfo={sortedStockInfo}
                onSort={onSort}
                visibleColumns={dashboardPreferences?.visibleColumns}
            />
            <HoldingInformation holdingSummary={holdingSummary} />
        </>
    ) : (
        <></>
    );
};
