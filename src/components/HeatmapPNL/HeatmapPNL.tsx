import {useEffect, useState} from 'react';
import {Treemap, ResponsiveContainer, Label} from 'recharts';
import {stockInfoGeneratorAll} from '../../helpers/price';
import {usePortfolio} from '../../hooks/usePortfolio';

import './styles.css';

const generateColorsPNL = (percentDayChange: number): string => {
    if (percentDayChange < 0) {
        if (percentDayChange <= -5) return '#0b0000';
        if (percentDayChange <= -3) return '#4e0000';
        if (percentDayChange <= -2) return '#550000';
        if (percentDayChange <= -1.5) return '#770000';
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
        if (percentDayChange >= 5) return '#182e0a';
        if (percentDayChange >= 4) return '#2c5212';
        if (percentDayChange >= 3) return '#356416';
        if (percentDayChange >= 2) return '#3f771a';
        if (percentDayChange >= 1.5) return '#49891d';
        if (percentDayChange >= 1) return '#529b21';
        if (percentDayChange >= 0.8) return '#6fd22d';
        if (percentDayChange >= 0.7) return '#7cd63f';
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
    const {marketData, userHoldings} = usePortfolio();
    const [chartData, setChartData] = useState<any>([]);

    const updateChart = () => {
        const stockInfo = stockInfoGeneratorAll(userHoldings, marketData);
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
                    name: `${stock.symbol} (${stock.percentDayChange.toFixed(2)}%)`,
                    fill: generateColorsPNL(stock.percentDayChange),
                    value: 1,
                    stroke: 'white'
                }))
        );
    };

    useEffect(() => {
        if (!userHoldings || !marketData || !marketData.length) return;
        updateChart();
        const intervalId = setInterval(() => {
            updateChart();
        }, 5000);
        return () => clearInterval(intervalId);
    }, [userHoldings, marketData]);

    return (
        <ResponsiveContainer className="heatmap" width="100%">
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
    );
};
