import {daysSinceEpoch, getPercentChange} from './price';
import {
    DateWiseHoldings,
    YearWiseStockInformation,
    HoldingItem,
    Holdings,
    StockInformation,
    Transaction,
    YearWiseHoldingItem,
    YearWiseHoldings,
    DateWiseHoldingItem,
    DateWiseStockInformation,
    MonthWiseHoldings,
    MonthWiseHoldingItem,
    MonthWiseStockInformation
} from '../types/transaction';

export const stockInfoGenerator = (holdingItem: HoldingItem, marketData: any[]): StockInformation => {
    const transactions = holdingItem.transactions;
    const symbol = holdingItem.symbol;
    let quantity = 0;
    let investedValue = 0;
    let daysMax = 0;
    transactions.forEach((transaction: any) => {
        quantity += transaction.quantity;
        const currInvested = transaction.quantity * transaction.avgPrice;
        investedValue += currInvested;
        daysMax = Math.max(daysMax, daysSinceEpoch(transaction.dateAdded));
    });

    const symbolMarketData = marketData.filter((data: any) => data.symbol === symbol)[0];
    const ltp = symbolMarketData.close ? symbolMarketData.close : symbolMarketData.lastPrice;
    const dayChange = ltp - symbolMarketData.previousClose;
    const totalDayChange = dayChange * quantity;
    const previousClose = symbolMarketData.previousClose;
    const percentDayChange = getPercentChange(ltp, previousClose);
    const percentDayChangeOnInvestment = (totalDayChange / investedValue) * 100;
    const currentValue = quantity * ltp;
    const avgPrice = investedValue / quantity;
    const pnl = currentValue - investedValue;
    const pnlpercent = (pnl / investedValue) * 100;

    return {
        symbol,
        quantity,
        avgPrice,
        investedValue,
        currentValue,
        pnl,
        pnlpercent,
        daysMax,
        ltp,
        totalDayChange,
        percentDayChange,
        percentDayChangeOnInvestment
    };
};

export const dateWiseStockInfoGeneratorAll = (holdings: Holdings, marketData: any[]): DateWiseStockInformation => {
    const dateWiseHoldings = getDateWiseHoldings(holdings);
    return dateWiseHoldings.map((dateWiseHoldingItem) => {
        return {
            date: dateWiseHoldingItem.date,
            stocksInfo: dateWiseHoldingItem.holdings.map((holdingItem: HoldingItem) =>
                stockInfoGenerator(holdingItem, marketData)
            )
        };
    });
};

export const monthWiseStockInfoGeneratorAll = (holdings: Holdings, marketData: any[]): MonthWiseStockInformation => {
    const monthWiseHoldings = getMonthWiseHoldings(holdings);
    return monthWiseHoldings.map((monthWiseHoldingItem) => {
        return {
            monthYear: monthWiseHoldingItem.month,
            stocksInfo: monthWiseHoldingItem.holdings.map((holdingItem: HoldingItem) =>
                stockInfoGenerator(holdingItem, marketData)
            )
        };
    });
};

export const yearWiseStockInfoGeneratorAll = (holdings: Holdings, marketData: any): YearWiseStockInformation => {
    const yearWiseHoldings = getYearWiseHoldings(holdings);
    return yearWiseHoldings.map((yearWiseHoldingItem: YearWiseHoldingItem) => {
        return {
            year: yearWiseHoldingItem.year,
            stocksInfo: yearWiseHoldingItem.holdings.map((holdingItem: HoldingItem) =>
                stockInfoGenerator(holdingItem, marketData)
            )
        };
    });
};

export const getDateWiseHoldings = (holdings: Holdings): DateWiseHoldings => {
    const dateWiseHoldings: DateWiseHoldings = [];
    holdings.forEach((holdingItem: HoldingItem) => {
        const transactions = holdingItem.transactions;
        transactions.forEach((transaction: Transaction) => {
            const holdingItemCopy: HoldingItem = JSON.parse(JSON.stringify(holdingItem));
            holdingItemCopy.transactions = [transaction];
            const date = epochToDate(transaction.dateAdded);

            const matchedDateWiseHolding = dateWiseHoldings.find(
                (dateWiseHoldingItem: DateWiseHoldingItem) => dateWiseHoldingItem.date === date
            );

            if (matchedDateWiseHolding) {
                matchedDateWiseHolding.holdings.push(holdingItemCopy);
            } else {
                dateWiseHoldings.push({
                    date,
                    holdings: [holdingItemCopy]
                });
            }
        });
    });
    return dateWiseHoldings;
};

export const getMonthWiseHoldings = (holdings: Holdings): MonthWiseHoldings => {
    const monthWiseHoldings: MonthWiseHoldings = [];
    holdings.forEach((holdingItem: HoldingItem) => {
        const transactions = holdingItem.transactions;
        transactions.forEach((transaction: Transaction) => {
            const holdingItemCopy: HoldingItem = JSON.parse(JSON.stringify(holdingItem));
            holdingItemCopy.transactions = [transaction];
            const month = epochToDate(transaction.dateAdded).split('-').splice(1).join('-');

            const matchedDateWiseHolding = monthWiseHoldings.find(
                (dateWiseHoldingItem: MonthWiseHoldingItem) => dateWiseHoldingItem.month === month
            );

            if (matchedDateWiseHolding) {
                matchedDateWiseHolding.holdings.push(holdingItemCopy);
            } else {
                monthWiseHoldings.push({
                    month,
                    holdings: [holdingItemCopy]
                });
            }
        });
    });
    return monthWiseHoldings;
};

export const getYearWiseHoldings = (holdings: Holdings): YearWiseHoldings => {
    const yearWiseHoldings: YearWiseHoldings = [];
    holdings.forEach((holdingItem: HoldingItem) => {
        const transactions = holdingItem.transactions;
        transactions.forEach((transaction: Transaction) => {
            const holdingItemCopy: HoldingItem = JSON.parse(JSON.stringify(holdingItem));
            holdingItemCopy.transactions = [transaction];
            const date = epochToDate(transaction.dateAdded);
            const year = date.split('-')[2];
            const matchedYearWiseHolding = yearWiseHoldings.find(
                (yearWiseHoldingItem: YearWiseHoldingItem) => yearWiseHoldingItem.year === year
            );
            if (matchedYearWiseHolding) {
                matchedYearWiseHolding.holdings.push(holdingItemCopy);
            } else {
                yearWiseHoldings.push({
                    year,
                    holdings: [holdingItemCopy]
                });
            }
        });
    });
    return yearWiseHoldings;
};

const epochToDate = (epochTime: number) => {
    const date = new Date(epochTime);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};
