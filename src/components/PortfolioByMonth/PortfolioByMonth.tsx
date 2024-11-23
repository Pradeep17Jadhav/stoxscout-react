import {getPnL} from '../../helpers/price';
import {useCallback, useEffect, useState} from 'react';
import {MonthWiseStockInformation} from '../../types/transaction';
import {monthWiseStockInfoGeneratorAll} from '../../helpers/portfolioByDateUtils';
import {HoldingTable, SortData} from '../HoldingTable/HoldingTable';
import {HoldingInformation} from '../HoldingInformation/HoldingInformation';
import {sort, sortHoldingsByMonth} from '../../helpers/sort';
import {usePortfolio} from '../../hooks/usePortfolio';
import {useUser} from '../../hooks/useUser';
import {getFormattedDate} from '../../helpers/dateUtils';
import usePreferences from '../../hooks/usePreferences';

import './styles.css';

export const PortfolioByMonth = () => {
    const {market} = usePortfolio();
    const {dashboardVisibleColumns} = usePreferences();
    const {holdings} = useUser();
    const [monthWiseStocksInfo, setMonthWiseStocksInfo] = useState<MonthWiseStockInformation>([]);

    useEffect(() => {
        if (!holdings || !market?.length) return;
        const monthWiseStockInfo = monthWiseStockInfoGeneratorAll(holdings, market);
        const sortedDateWiseStockInfo = sortHoldingsByMonth(monthWiseStockInfo);
        setMonthWiseStocksInfo(sortedDateWiseStockInfo);
    }, [holdings, market]);

    const onSort = useCallback(
        ({column, orderBy, monthYear}: SortData) => {
            let index = -1;
            if (!monthYear) {
                return;
            }
            const stocksInfoForMonthYear = monthWiseStocksInfo.find((stockInfoForMonthYear, i) => {
                if (stockInfoForMonthYear.monthYear === monthYear) {
                    index = i;
                    return true;
                }
                return false;
            });
            if (!stocksInfoForMonthYear || index === -1) {
                return;
            }
            const sortedStocksInfo = sort(stocksInfoForMonthYear.stocksInfo, column, orderBy);
            setMonthWiseStocksInfo((monthWiseStocksInfo: MonthWiseStockInformation) => {
                const monthYearWiseStockInformationCopy = JSON.parse(JSON.stringify(monthWiseStocksInfo));
                monthYearWiseStockInformationCopy[index].stocksInfo = sortedStocksInfo;
                return monthYearWiseStockInformationCopy;
            });
        },
        [monthWiseStocksInfo]
    );

    return (
        <>
            {monthWiseStocksInfo.map((monthWiseStocksInfoItem) => (
                <div className="month-container" key={`${monthWiseStocksInfoItem.monthYear}`}>
                    <div className="monthPurchased">{getFormattedDate(monthWiseStocksInfoItem.monthYear)}</div>
                    <div>
                        <div>
                            <HoldingTable
                                stocksInfo={monthWiseStocksInfoItem.stocksInfo}
                                monthYear={monthWiseStocksInfoItem.monthYear}
                                onSort={onSort}
                                visibleColumns={dashboardVisibleColumns}
                            />
                        </div>
                        <HoldingInformation holdingSummary={getPnL(monthWiseStocksInfoItem.stocksInfo)} />
                    </div>
                </div>
            ))}
        </>
    );
};
