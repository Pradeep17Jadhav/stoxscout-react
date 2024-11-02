import { sort } from '../../helpers/sort';
import { Order } from '../../types/transaction';
import { HoldingTable } from '../HoldingTable/HoldingTable';
import { HoldingInformation } from '../HoldingInformation/HoldingInformation';
import { usePortfolio } from '../../hooks/usePortfolio';

import './styles.css';

export const Portfolio = () => {
    const { holdingSummary, stocksInfo, dispatch } = usePortfolio();
    const onSort = (column: string, order: Order) => dispatch({ type: 'UPDATE_STOCKS_INFO', payload: sort(stocksInfo, column, order) });

    return (
        <>
            <HoldingTable stocksInfo={stocksInfo} onSort={onSort} />
            <HoldingInformation holdingSummary={holdingSummary} />
        </>
    );
};
