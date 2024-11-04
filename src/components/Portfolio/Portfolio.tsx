import {sort} from '../../helpers/sort';
import {Order} from '../../types/transaction';
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
    const {holdingSummary} = useUser();

    const onSort = (column: string, order: Order) => dispatch(updateStocksInfo(sort(stocksInfo, column, order)));

    return (
        <>
            <HoldingTable stocksInfo={stocksInfo} onSort={onSort} />
            <HoldingInformation holdingSummary={holdingSummary} />
        </>
    );
};
