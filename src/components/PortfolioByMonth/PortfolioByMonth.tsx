import {getPnL} from '../../helpers/price';
import {useEffect, useState} from 'react';
import {MonthWiseStockInformation} from '../../types/transaction';
import {monthWiseStockInfoGeneratorAll} from '../../helpers/portfolioByDateUtils';
import {HoldingTable} from '../HoldingTable/HoldingTable';
import {HoldingInformation} from '../HoldingInformation/HoldingInformation';
import {sortHoldingsByMonth} from '../../helpers/sort';
import {usePortfolio} from '../../hooks/usePortfolio';
import {useUser} from '../../hooks/useUser';

import './styles.css';

export const PortfolioByMonth = () => {
    const {market} = usePortfolio();
    const {holdings} = useUser();
    const [monthWiseStocksInfo, setMonthWiseStocksInfo] = useState<MonthWiseStockInformation>([]);

    useEffect(() => {
        if (!holdings || !market?.length) return;
        const monthWiseStockInfo = monthWiseStockInfoGeneratorAll(holdings, market);
        const sortedDateWiseStockInfo = sortHoldingsByMonth(monthWiseStockInfo);
        setMonthWiseStocksInfo(sortedDateWiseStockInfo);
    }, [holdings, market]);

    return (
        <>
            {monthWiseStocksInfo.map((monthWiseStocksInfoItem) => (
                <div className="month-container" key={`${monthWiseStocksInfoItem.monthYear}`}>
                    <div className="monthPurchased">{monthWiseStocksInfoItem.monthYear}</div>
                    <div>
                        <div>
                            <HoldingTable
                                stocksInfo={monthWiseStocksInfoItem.stocksInfo}
                                monthYear={monthWiseStocksInfoItem.monthYear}
                            />
                        </div>
                        <HoldingInformation holdingSummary={getPnL(monthWiseStocksInfoItem.stocksInfo)} />
                    </div>
                </div>
            ))}
        </>
    );
};
