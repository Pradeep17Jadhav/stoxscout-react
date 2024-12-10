import {MarketData} from '../types/market';
import {HoldingSummary, HoldingItem, Holdings, StockInformation} from '../types/transaction';

export const stockInfoGeneratorNSE = (holdingItem: HoldingItem, marketData: MarketData): StockInformation => {
    const transactions = holdingItem.transactions;
    const symbol = holdingItem.symbol;
    let quantity = 0;
    let investedValue = 0;
    let daysMax = 0;
    transactions.forEach((transaction) => {
        quantity += transaction.quantity;
        const currInvested = transaction.quantity * transaction.avgPrice;
        investedValue += currInvested;
        daysMax = Math.max(daysMax, daysSinceEpoch(transaction.dateAdded));
    });

    let symbolMarketData = marketData.filter((data: any) => data.symbol === symbol)[0];

    if (!symbolMarketData) {
        symbolMarketData = {
            symbol: '',
            close: 0,
            lastPrice: 0,
            previousClose: 0,
            change: 0,
            pChange: 0,
            open: 0,
            basePrice: 0
        };
    }
    const ltp = symbolMarketData.close ? symbolMarketData.close : symbolMarketData.lastPrice;
    const previousClose = symbolMarketData.previousClose;
    const dayChange = ltp - previousClose;
    const totalDayChange = dayChange * quantity;
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
        ltp,
        totalDayChange,
        percentDayChange,
        percentDayChangeOnInvestment,
        daysMax
    };
};

export const getPercentChange = (newPrice: number, oldPrice: number) => {
    if (!newPrice || !oldPrice) return 0;
    return ((newPrice - oldPrice) / oldPrice) * 100;
};

export const stockInfoGeneratorAll = (holdings: Holdings, marketData: MarketData): StockInformation[] =>
    holdings.map((holdingItem) => stockInfoGeneratorNSE(holdingItem, marketData));

export const transformTypes = (rawHolding: any) => {
    const holdings = rawHolding.map((holdingItem: any) => {
        const transactions = holdingItem.transactions.map((transaction: any) => {
            return {
                ...transaction,
                dateAdded: parseInt(transaction.dateAdded),
                avgPrice: parseFloat(transaction.avgPrice)
            };
        });
        return {
            ...holdingItem,
            transactions: transactions
        };
    });
    return holdings;
};

export const getPnL = (stocksInfo: StockInformation[]): HoldingSummary => {
    let totalPnl = 0;
    let totalInvestedValue = 0;
    let totalCurrentValue = 0;
    let totalDayChange = 0;
    stocksInfo.forEach((stockInfo: StockInformation) => {
        totalPnl += stockInfo.pnl;
        totalInvestedValue += stockInfo.investedValue;
        totalCurrentValue += stockInfo.currentValue;
        totalDayChange += stockInfo.totalDayChange;
    });

    return {
        totalPnl: formatPrice(totalPnl),
        totalInvestedValue: formatPrice(totalInvestedValue),
        totalCurrentValue: formatPrice(totalCurrentValue),
        totalPnlPercentage: formatPrice(getPercentChange(totalCurrentValue, totalInvestedValue)),
        totalDayChange: formatPrice(totalDayChange),
        totalDayChangePercentage: formatPrice(getPercentChange(totalCurrentValue + totalDayChange, totalCurrentValue))
    };
};

export const daysSinceEpoch = (epochTime: number) => {
    const currentEpochTime = Date.now();
    const millisecondsSinceEpoch = currentEpochTime - epochTime;
    const secondsSinceEpoch = millisecondsSinceEpoch / 1000;
    const daysSinceEpoch = secondsSinceEpoch / (60 * 60 * 24);
    return Math.floor(daysSinceEpoch);
};

export const calculateCAGR = (days: number, invested: number, currentValue: number): number => {
    const totalReturn = (currentValue - invested) / invested;
    const annualizedReturn = Math.pow(1 + totalReturn, 365 / days) - 1;
    const cagr = (Math.pow(1 + annualizedReturn, 1) - 1) * 100;
    return parseFloat(cagr.toFixed(2));
};

export const formatPrice = (price: number, minimumFractionDigits?: number) => {
    return price.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: minimumFractionDigits === undefined ? 2 : minimumFractionDigits
    });
};

export const getProfitLossClassname = (price: string, isDark?: boolean) => {
    if (isDark) {
        return parseFloat(price) >= 0 ? 'profitDark' : 'lossDark';
    }
    return parseFloat(price) >= 0 ? 'profit' : 'loss';
};

export const numberToRupeesInWords = (num: number): string => {
    if (num === 0) return 'Zero rupee';
    if (num === 1) return 'One rupee';
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = [
        'Ten',
        'Eleven',
        'Twelve',
        'Thirteen',
        'Fourteen',
        'Fifteen',
        'Sixteen',
        'Seventeen',
        'Eighteen',
        'Nineteen'
    ];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const scales = ['', 'Thousand', 'Lakh', 'Crore'];

    const numberToWords = (n: number): string => {
        if (n === 0) return 'Zero';
        if (n < 10) return units[n];
        if (n < 20) return teens[n - 10];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + units[n % 10] : '');
        if (n < 1000)
            return units[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + numberToWords(n % 100) : '');
        return '';
    };

    const splitIntoGroups = (num: number): number[] => {
        const groups: number[] = [];
        let isThousandHandled = false;

        while (num > 0) {
            if (!isThousandHandled) {
                groups.push(num % 1000);
                num = Math.floor(num / 1000);
                isThousandHandled = true;
            } else {
                groups.push(num % 100);
                num = Math.floor(num / 100);
            }
        }

        return groups.reverse();
    };

    const groups = splitIntoGroups(num);
    let words = '';
    for (let i = 0; i < groups.length; i++) {
        if (groups[i]) {
            words +=
                (words ? ' ' : '') +
                numberToWords(groups[i]) +
                (scales[groups.length - i - 1] ? ' ' + scales[groups.length - i - 1] : '');
        }
    }

    return words.trim() + ' Rupees';
};
