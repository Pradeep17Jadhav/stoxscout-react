import {useCallback, useEffect, useState} from 'react';
import {Treemap, ResponsiveContainer, Label} from 'recharts';
import {stockInfoGeneratorAll} from '../../helpers/price';
import {usePortfolio} from '../../hooks/usePortfolio';
import {useUser} from '../../hooks/useUser';
import {StockInformation} from '../../types/transaction';
import './styles.css';

const generateColorsPNL = (percentDayChange: number): string => {
    if (percentDayChange < 0) {
        if (percentDayChange <= -10) return '#0b0000';
        if (percentDayChange <= -7) return '#4e0000';
        if (percentDayChange <= -5) return '#5f0000';
        if (percentDayChange <= -3) return '#550000';
        if (percentDayChange <= -2) return '#6c0000';
        if (percentDayChange <= -1.5) return '#830000';
        if (percentDayChange <= -1) return '#990000';
        if (percentDayChange <= -0.8) return '#bb0000';
        if (percentDayChange <= -0.7) return '#dd0000';
        if (percentDayChange <= -0.6) return '#ff0000';
        if (percentDayChange <= -0.5) return '#ff2222';
        if (percentDayChange <= -0.4) return '#ff4444';
        if (percentDayChange <= -0.3) return '#ff6666';
        if (percentDayChange <= -0.2) return '#ff8888';
        if (percentDayChange <= -0.1) return '#ffcccc';
        if (percentDayChange <= -0.05) return '#ffeeee';
        if (percentDayChange < 0) return '#fff4f4';
    } else {
        if (percentDayChange >= 10) return '#182e0a';
        if (percentDayChange >= 7) return '#2c5212';
        if (percentDayChange >= 5) return '#2d5c0e';
        if (percentDayChange >= 3) return '#3f771a';
        if (percentDayChange >= 2) return '#49891d';
        if (percentDayChange >= 1.5) return '#529b21';
        if (percentDayChange >= 1) return '#51b012';
        if (percentDayChange >= 0.8) return '#7cd63f';
        if (percentDayChange >= 0.6) return '#88da52';
        if (percentDayChange >= 0.5) return '#95de64';
        if (percentDayChange >= 0.4) return '#a1e276';
        if (percentDayChange >= 0.3) return '#aee588';
        if (percentDayChange >= 0.2) return '#bae99b';
        if (percentDayChange >= 0.1) return '#c7edad';
        if (percentDayChange > 0) return '#d3f1bf';
    }
    return '#D3D3D3';
};

export const HeatMapPNL = () => {
    const {market} = usePortfolio();
    const {holdings} = useUser();
    const [chartData, setChartData] = useState<any>([]);

    const generateStockName = (stock: StockInformation): string => {
        const symbol = stock.symbol;
        const dayChangePercent = stock.percentDayChange.toFixed(2);
        const dayChangeTotal = stock.totalDayChange.toFixed(2);
        return `${symbol} (\n${dayChangePercent}% - \n${dayChangeTotal})`;
    };

    const updateChart = useCallback(() => {
        const stockInfo = stockInfoGeneratorAll(holdings, market);
        let maxLossPercent = Infinity;
        let maxProfitPercent = -Infinity;
        for (const stock of stockInfo) {
            if (stock.percentDayChange < maxLossPercent) maxLossPercent = stock.percentDayChange;
            if (stock.percentDayChange > maxProfitPercent) maxProfitPercent = stock.percentDayChange;
        }

        setChartData(
            stockInfo
                .sort((a, b) => b.percentDayChange - a.percentDayChange)
                .map((stock) => ({
                    name: generateStockName(stock),
                    fill: generateColorsPNL(stock.percentDayChange),
                    value: 1,
                    stroke: 'white'
                }))
        );
    }, [market, holdings]);

    useEffect(() => {
        if (!holdings || !market?.length) return;
        updateChart();
        const intervalId = setInterval(() => {
            updateChart();
        }, 5000);
        return () => clearInterval(intervalId);
    }, [holdings, market, updateChart]);

    return (
        <div className="heatmap">
            <ResponsiveContainer width="100%">
                {chartData?.length && (
                    <Treemap
                        data={chartData}
                        dataKey="value"
                        stroke="#000"
                        isAnimationActive={false}
                        aspectRatio={4 / 3}
                        style={{color: '#ff000'}}
                    >
                        <Label position="center" fill="#fff" />
                    </Treemap>
                )}
            </ResponsiveContainer>
        </div>
    );
};
