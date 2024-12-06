import {useCallback, useEffect, useState} from 'react';
import {getPnL} from '../../helpers/price';
import {YearWiseStockInformation} from '../../types/transaction';
import {HoldingTable, SortData} from '../HoldingTable/HoldingTable';
import {HoldingInformation} from '../HoldingInformation/HoldingInformation';
import {sort, sortHoldingsByYear} from '../../helpers/sort';
import {yearWiseStockInfoGeneratorAll} from '../../helpers/portfolioByDateUtils';
import {usePortfolio} from '../../hooks/usePortfolio';
import {useUser} from '../../hooks/useUser';
import usePreferences from '../../hooks/usePreferences';

export const PortfolioByYear = () => {
    const {market} = usePortfolio();
    const {dashboardVisibleColumns} = usePreferences();
    const {holdings} = useUser();
    const [yearWiseStocksInfo, setYearWiseStocksInfo] = useState<YearWiseStockInformation>([]);

    useEffect(() => {
        if (!holdings || !market) return;
        const yearWiseStockInfo = yearWiseStockInfoGeneratorAll(holdings, market);
        const sortedYearWiseStockInfo = sortHoldingsByYear(yearWiseStockInfo);
        setYearWiseStocksInfo(sortedYearWiseStockInfo);
    }, [holdings, market]);

    const onSort = useCallback(
        ({column, orderBy, year}: SortData) => {
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
            const sortedStocksInfo = sort(stocksInfoForDate.stocksInfo, column, orderBy);
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
                <div key={yearWiseStocksInfoItem.year}>
                    <h4 className="purchasedDateTitle">{yearWiseStocksInfoItem.year}</h4>
                    <div>
                        <div>
                            <HoldingTable
                                stocksInfo={yearWiseStocksInfoItem.stocksInfo}
                                onSort={onSort}
                                year={yearWiseStocksInfoItem.year}
                                visibleColumns={dashboardVisibleColumns}
                            />
                        </div>
                        <HoldingInformation holdingSummary={getPnL(yearWiseStocksInfoItem.stocksInfo)} />
                    </div>
                </div>
            ))}
        </>
    );
};
