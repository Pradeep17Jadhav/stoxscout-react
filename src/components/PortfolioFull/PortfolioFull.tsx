import {useCallback, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {sort} from '../../helpers/sort';
import {StockInformation} from '../../types/transaction';
import {HoldingTable, SortData} from '../HoldingTable/HoldingTable';
import {HoldingInformation} from '../HoldingInformation/HoldingInformation';
import {usePortfolio} from '../../hooks/usePortfolio';
import {useUser} from '../../hooks/useUser';
import {DashboardPreferences} from '../../types/userPreferences';
import usePreferences from '../../hooks/usePreferences';
import {AppDispatch} from '../../redux/store/store';
import {useApp} from '../../hooks/useApp';

import './styles.css';

export const PortfolioFull = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {stocksInfo} = usePortfolio();
    const {holdingSummary, preferences} = useUser();
    const {dashboardPreferences, dashboardVisibleColumns, updateDashboardPreferences} = usePreferences();
    const [sortedStockInfo, setSortedStockInfo] = useState<StockInformation[]>(stocksInfo);
    const {isLoading} = useApp();

    const onSort = useCallback(
        ({column, orderBy}: SortData) => {
            if (!stocksInfo?.length) {
                return;
            }
            if (column !== dashboardPreferences?.sortColumn || orderBy !== dashboardPreferences?.sortOrder) {
                const newDashboardPreference: DashboardPreferences = {
                    ...dashboardPreferences,
                    sortColumn: column,
                    sortOrder: orderBy
                };
                dispatch(updateDashboardPreferences(newDashboardPreference));
            }
            const sortedStocksInfo = sort(stocksInfo, column, orderBy);
            setSortedStockInfo(sortedStocksInfo);
        },
        [dashboardPreferences, stocksInfo, dispatch, updateDashboardPreferences]
    );

    useEffect(() => {
        const prefColumn = dashboardPreferences?.sortColumn;
        const prefSortOrder = dashboardPreferences?.sortOrder;
        if (prefColumn && prefSortOrder) {
            onSort({column: prefColumn, orderBy: prefSortOrder});
        }
    }, [stocksInfo, preferences, dashboardPreferences?.sortColumn, dashboardPreferences?.sortOrder, onSort]);

    return !isLoading ? (
        <>
            <HoldingTable stocksInfo={sortedStockInfo} onSort={onSort} visibleColumns={dashboardVisibleColumns} />
            <HoldingInformation holdingSummary={holdingSummary} />
        </>
    ) : (
        <></>
    );
};
