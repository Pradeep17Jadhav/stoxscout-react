import {useCallback, useEffect} from 'react';
import {sort} from '../../helpers/sort';
import {Sort_Order} from '../../types/transaction';
import {HoldingTable} from '../HoldingTable/HoldingTable';
import {HoldingInformation} from '../HoldingInformation/HoldingInformation';
import {usePortfolio} from '../../hooks/usePortfolio';
import {useUser} from '../../hooks/useUser';
import {updateStocksInfo} from '../../redux/actions/portfolioActions';
import {useDispatch} from 'react-redux';

import './styles.css';

export const Portfolio = () => {
    const dispatch = useDispatch();
    const {stocksInfo} = usePortfolio();
    const {holdingSummary, userPreferences} = useUser();

    const onSort = useCallback(
        (column: string, order: Sort_Order) => {
            const sortedStocksInfo = sort(stocksInfo, column, order);
            dispatch(updateStocksInfo(sortedStocksInfo));
        },
        [dispatch, stocksInfo]
    );

    useEffect(() => {
        const prefColumn = userPreferences.dashboardSort.column;
        const prefSortOrder = userPreferences.dashboardSort.sortOrder;
        onSort(prefColumn, prefSortOrder);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <HoldingTable stocksInfo={stocksInfo} onSort={onSort} />
            <HoldingInformation holdingSummary={holdingSummary} />
        </>
    );
};
