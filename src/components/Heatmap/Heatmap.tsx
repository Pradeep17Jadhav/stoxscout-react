import {useEffect, useState} from 'react';
import {Treemap, ResponsiveContainer, Label} from 'recharts';
import {stockInfoGeneratorAll} from '../../helpers/price';
import {usePortfolio} from '../../hooks/usePortfolio';
import {useUser} from '../../hooks/useUser';

import './styles.css';

export const HeatMap = () => {
    const {market} = usePortfolio();
    const {holdings} = useUser();
    const [chartData, setChartData] = useState<any>([]);

    useEffect(() => {
        if (!holdings || !market?.length) return;
        const stockInfo = stockInfoGeneratorAll(holdings, market);
        setChartData(
            stockInfo
                .sort((a, b) => b.currentValue - a.currentValue)
                .map((stock) => ({
                    name: `${stock.symbol} (${stock.currentValue.toFixed(2)})`,
                    value: stock.currentValue
                }))
        );
    }, [holdings, market]);

    return (
        <div className="heatmap-container">
            <ResponsiveContainer className="heatmap" width="100%">
                {chartData?.length && (
                    <Treemap data={chartData} dataKey="value" stroke="#fff" isAnimationActive={false}>
                        <Label position="center" fill="#fff" fontSize={16} />
                    </Treemap>
                )}
            </ResponsiveContainer>
        </div>
    );
};
