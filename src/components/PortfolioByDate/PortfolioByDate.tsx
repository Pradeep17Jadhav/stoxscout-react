import {getPnL} from '../../helpers/price';
import {useCallback, useEffect, useState} from 'react';
import {DateWiseStockInformation} from '../../types/transaction';
import {dateWiseStockInfoGeneratorAll} from '../../helpers/portfolioByDateUtils';
import {HoldingTable, SortData} from '../HoldingTable/HoldingTable';
import {HoldingInformation} from '../HoldingInformation/HoldingInformation';
import {sort, sortHoldingsByDate} from '../../helpers/sort';
import {usePortfolio} from '../../hooks/usePortfolio';
import {useUser} from '../../hooks/useUser';
import {getFormattedDate} from '../../helpers/dateUtils';
import usePreferences from '../../hooks/usePreferences';

import './styles.css';

export const PortfolioByDate = () => {
    const {market} = usePortfolio();
    const {dashboardVisibleColumns} = usePreferences();
    const {holdings} = useUser();
    const [dateWiseStocksInfo, setDateWiseStocksInfo] = useState<DateWiseStockInformation>([]);

    useEffect(() => {
        if (!holdings || !market || !market.length) return;
        const dateWiseStockInfo = dateWiseStockInfoGeneratorAll(holdings, market);
        const sortedDateWiseStockInfo = sortHoldingsByDate(dateWiseStockInfo);
        setDateWiseStocksInfo(sortedDateWiseStockInfo);
    }, [holdings, market]);

    const onSort = useCallback(
        ({column, orderBy, date}: SortData) => {
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
            const sortedStocksInfo = sort(stocksInfoForDate.stocksInfo, column, orderBy);
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
                <div className="day-container" key={`${dateWiseStocksInfoItem.date}`}>
                    <div className="datePurchased">{getFormattedDate(dateWiseStocksInfoItem.date)}</div>
                    <div>
                        <div>
                            <HoldingTable
                                stocksInfo={dateWiseStocksInfoItem.stocksInfo}
                                onSort={onSort}
                                date={dateWiseStocksInfoItem.date}
                                visibleColumns={dashboardVisibleColumns}
                            />
                        </div>
                        <HoldingInformation holdingSummary={getPnL(dateWiseStocksInfoItem.stocksInfo)} />
                    </div>
                </div>
            ))}
        </>
    );
};
