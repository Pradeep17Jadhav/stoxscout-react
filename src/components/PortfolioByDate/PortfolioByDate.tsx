import {getPnL} from '../../helpers/price';
import {useCallback, useEffect, useState} from 'react';
import {DateWiseStockInformation, SORT_ORDER} from '../../types/transaction';
import {dateWiseStockInfoGeneratorAll} from '../../helpers/portfolioByDateUtils';
import {HoldingTable} from '../HoldingTable/HoldingTable';
import {HoldingInformation} from '../HoldingInformation/HoldingInformation';
import {sort, sortHoldingsByDate} from '../../helpers/sort';
import {usePortfolio} from '../../hooks/usePortfolio';
import {useUser} from '../../hooks/useUser';
import {DEFAULT_COLUMNS} from '../../types/userPreferences';

import './styles.css';

export const PortfolioByDate = () => {
    const {marketData} = usePortfolio();
    const {userHoldings} = useUser();
    const [dateWiseStocksInfo, setDateWiseStocksInfo] = useState<DateWiseStockInformation>([]);

    useEffect(() => {
        if (!userHoldings || !marketData || !marketData.length) return;
        const dateWiseStockInfo = dateWiseStockInfoGeneratorAll(userHoldings, marketData);
        const sortedDateWiseStockInfo = sortHoldingsByDate(dateWiseStockInfo);
        setDateWiseStocksInfo(sortedDateWiseStockInfo);
    }, [userHoldings, marketData]);

    const onSort = useCallback(
        (column: DEFAULT_COLUMNS, order: SORT_ORDER, date?: string) => {
            let index = -1;
            if (!date) {
                return;
            }
            const stocksInfoForDate = dateWiseStocksInfo.find((stockInfoForDate, i) => {
                if (stockInfoForDate.date === date) {
                    index = i;
                    return true;
                }
                return false;
            });
            if (!stocksInfoForDate || index === -1) {
                return;
            }
            const sortedStocksInfo = sort(stocksInfoForDate.stocksInfo, column, order);
            setDateWiseStocksInfo((dateWiseStockInformation: DateWiseStockInformation) => {
                const dateWiseStockInformationCopy = JSON.parse(JSON.stringify(dateWiseStockInformation));
                dateWiseStockInformationCopy[index].stocksInfo = sortedStocksInfo;
                return dateWiseStockInformationCopy;
            });
        },
        [dateWiseStocksInfo]
    );

    return (
        <>
            {dateWiseStocksInfo.map((dateWiseStocksInfoItem) => (
                <div key={`${dateWiseStocksInfoItem.date}`}>
                    <div className="datePurchased">{dateWiseStocksInfoItem.date}</div>
                    <div>
                        <div>
                            <HoldingTable
                                stocksInfo={dateWiseStocksInfoItem.stocksInfo}
                                onSort={onSort}
                                date={dateWiseStocksInfoItem.date}
                            />
                        </div>
                        <HoldingInformation holdingSummary={getPnL(dateWiseStocksInfoItem.stocksInfo)} />
                    </div>
                </div>
            ))}
        </>
    );
};
