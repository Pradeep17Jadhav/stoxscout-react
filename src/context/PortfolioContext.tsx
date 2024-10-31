import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { HoldingSummary, StockInformation } from '../types/transaction';
import useMarketData from '../hooks/useMarketData';
import useUserHoldings from '../hooks/useUserHoldings';
import { getPnL, stockInfoGeneratorAll } from '../helpers/price';

type PortfolioContextType = {
    holdingSummary: HoldingSummary;
    stocksInfo: StockInformation[];
    setStocksInfo: React.Dispatch<React.SetStateAction<StockInformation[]>>
};

export const PortfolioContext = React.createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
    const { marketData } = useMarketData();
    const { userHoldings } = useUserHoldings();
    const [stocksInfo, setStocksInfo] = useState<StockInformation[]>([]);

    const [holdingSummary, setHoldingSummary] = useState<HoldingSummary>({
        totalPnl: "0",
        totalInvestedValue: "0",
        totalCurrentValue: "0",
        totalPnlPercentage: "0",
        totalDayChange: "0",
        totalDayChangePercentage: "0",
    });

    const updateTable = () => {
        const stockInfo = stockInfoGeneratorAll(userHoldings, marketData);
        setStocksInfo(stockInfo);
        setHoldingSummary(getPnL(stockInfo));
    }

    useEffect(() => {
        if (!userHoldings || !marketData || !marketData.length) return;
        updateTable();
        const intervalId = setInterval(() => updateTable(), 60000);
        return () => clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [marketData, userHoldings]);

    return (
        <PortfolioContext.Provider value={{ holdingSummary, stocksInfo, setStocksInfo }}>
            {children}
        </PortfolioContext.Provider>
    );
};