import {useCallback, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {sort} from '../../helpers/sort';
import {SORT_ORDER, StockInformation} from '../../types/transaction';
import {HoldingTable} from '../HoldingTable/HoldingTable';
import {HoldingInformation} from '../HoldingInformation/HoldingInformation';
import {usePortfolio} from '../../hooks/usePortfolio';
import {useUser} from '../../hooks/useUser';
import {DashboardPreferences, DEFAULT_COLUMNS} from '../../types/userPreferences';
import usePreferences from '../../hooks/usePreferences';

import './styles.css';

export const Portfolio = () => {
    const dispatch = useDispatch();
    const {stocksInfo, marketData} = usePortfolio();
    const {holdingSummary, preferences} = useUser();
    const {dashboardPreferences, updateDashboardPreferences} = usePreferences();
    const [sortedStockInfo, setSortedStockInfo] = useState<StockInformation[]>(stocksInfo);

    const onSort = useCallback(
        (column: DEFAULT_COLUMNS, order: SORT_ORDER) => {
            if (column !== dashboardPreferences?.sortColumn || order !== dashboardPreferences?.sortOrder) {
                const newDevicePreference: DashboardPreferences = {
                    ...dashboardPreferences,
                    sortColumn: column,
                    sortOrder: order
                };
                dispatch(updateDashboardPreferences(newDevicePreference));
                // updatePreference(newPreference);
            }
            const sortedStocksInfo = sort(stocksInfo, column, order);
            setSortedStockInfo(sortedStocksInfo);
        },
        [dashboardPreferences, stocksInfo, preferences, dispatch]
    );

    useEffect(() => {
        const prefColumn = dashboardPreferences?.sortColumn;
        const prefSortOrder = dashboardPreferences?.sortOrder;
        if (prefColumn && prefSortOrder) {
            onSort(prefColumn, prefSortOrder);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [marketData, preferences]);

    return (
        <>
            <HoldingTable
                stocksInfo={sortedStockInfo}
                onSort={onSort}
                visibleColumns={dashboardPreferences?.visibleColumns}
            />
            <HoldingInformation holdingSummary={holdingSummary} />
        </>
    );
};
