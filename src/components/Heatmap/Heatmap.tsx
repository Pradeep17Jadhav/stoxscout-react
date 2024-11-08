import {useEffect, useState} from 'react';
import {Treemap, ResponsiveContainer, Label} from 'recharts';
import {stockInfoGeneratorAll} from '../../helpers/price';
import {usePortfolio} from '../../hooks/usePortfolio';
import {useUser} from '../../hooks/useUser';

import './styles.css';

export const HeatMap = () => {
    const {marketData} = usePortfolio();
    const {userHoldings} = useUser();
    const [chartData, setChartData] = useState<any>([]);

    useEffect(() => {
        if (!userHoldings || !marketData || !marketData.length) return;
        const stockInfo = stockInfoGeneratorAll(userHoldings, marketData);
        setChartData(
            stockInfo
                .sort((a, b) => b.currentValue - a.currentValue)
                .map((stock) => ({
                    name: `${stock.symbol} (${stock.currentValue.toFixed(2)})`,
                    value: stock.currentValue
                }))
        );
    }, [userHoldings, marketData]);

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
