import {useCallback, useEffect, useState} from 'react';
import {getPnL} from '../../helpers/price';
import {SORT_ORDER, YearWiseStockInformation} from '../../types/transaction';
import {HoldingTable} from '../HoldingTable/HoldingTable';
import {HoldingInformation} from '../HoldingInformation/HoldingInformation';
import {sort, sortHoldingsByYear} from '../../helpers/sort';
import {yearWiseStockInfoGeneratorAll} from '../../helpers/portfolioByDateUtils';
import {usePortfolio} from '../../hooks/usePortfolio';
import {useUser} from '../../hooks/useUser';
import {DEFAULT_COLUMNS} from '../../types/userPreferences';

import './styles.css';

export const PortfolioByYear = () => {
    const {marketData} = usePortfolio();
    const {userHoldings} = useUser();
    const [yearWiseStocksInfo, setYearWiseStocksInfo] = useState<YearWiseStockInformation>([]);

    useEffect(() => {
        if (!userHoldings || !marketData) return;
        const yearWiseStockInfo = yearWiseStockInfoGeneratorAll(userHoldings, marketData);
        const sortedYearWiseStockInfo = sortHoldingsByYear(yearWiseStockInfo);
        setYearWiseStocksInfo(sortedYearWiseStockInfo);
    }, [userHoldings, marketData]);

    const onSort = useCallback(
        (column: DEFAULT_COLUMNS, order: SORT_ORDER, year?: string) => {
            let index = -1;
            if (!year) {
                return;
            }
            const stocksInfoForDate = yearWiseStocksInfo.find((stockInfoForDate, i) => {
                if (stockInfoForDate.year === year) {
                    index = i;
                    return true;
                }
                return false;
            });
            if (!stocksInfoForDate || index === -1) {
                return;
            }
            const sortedStocksInfo = sort(stocksInfoForDate.stocksInfo, column, order);
            setYearWiseStocksInfo((yearWiseStockInformation: YearWiseStockInformation) => {
                const yearWiseStockInformationCopy = JSON.parse(JSON.stringify(yearWiseStockInformation));
                yearWiseStockInformationCopy[index].stocksInfo = sortedStocksInfo;
                return yearWiseStockInformationCopy;
            });
        },
        [yearWiseStocksInfo]
    );

    return (
        <>
            {yearWiseStocksInfo.map((yearWiseStocksInfoItem) => (
                <div className="year-container" key={`${yearWiseStocksInfoItem.year}`}>
                    <div className="yearPurchased">{yearWiseStocksInfoItem.year}</div>
                    <div>
                        <div>
                            <HoldingTable
                                stocksInfo={yearWiseStocksInfoItem.stocksInfo}
                                onSort={onSort}
                                year={yearWiseStocksInfoItem.year}
                            />
                        </div>
                        <HoldingInformation holdingSummary={getPnL(yearWiseStocksInfoItem.stocksInfo)} />
                    </div>
                </div>
            ))}
        </>
    );
};
