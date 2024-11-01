import { useEffect, useState } from 'react';
import { Treemap, ResponsiveContainer, Label } from 'recharts';
import { stockInfoGeneratorAll } from '../../helpers/price';
import { usePortfolio } from '../../hooks/usePortfolio';

import "./styles.css";

export const HeatMap = () => {
    const { marketData, userHoldings } = usePortfolio();
    const [chartData, setChartData] = useState<any>([]);

    useEffect(() => {
        if (!userHoldings || !marketData || !marketData.length) return;
        const stockInfo = stockInfoGeneratorAll(userHoldings, marketData);
        setChartData(stockInfo.sort((a, b) => b.currentValue - a.currentValue).map((stock) => ({
            name: `${stock.symbol} (${stock.currentValue.toFixed(2)})`,
            value: stock.currentValue,
        })));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userHoldings, marketData]);

    return (
        <ResponsiveContainer className="heatmap" width="100%" height="100%">
            {chartData?.length && (
                <Treemap
                    data={chartData}
                    dataKey="value"
                    stroke="#fff"
                    isAnimationActive={false}
                >
                    <Label position="center" fill="#fff" fontSize={16} />
                </Treemap>
            )}
        </ResponsiveContainer>
    );
};
