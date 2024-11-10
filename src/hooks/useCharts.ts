import {useCallback} from 'react';
import {axisClasses} from '@mui/x-charts/ChartsAxis';
import {usePortfolio} from './usePortfolio';
import {SORT_ORDER} from '../types/transaction';
import {sort} from '../helpers/sort';
import {DEFAULT_COLUMNS} from '../types/userPreferences';

export const useChartsData = () => {
    const {stocksInfo} = usePortfolio();

    const getTotalProfitLoss = useCallback(
        (sortOrder: SORT_ORDER) => {
            const sorted = sort(stocksInfo, DEFAULT_COLUMNS.NET_PNL, sortOrder).slice(0, 5);
            const seriesData = [
                {
                    data: sorted.map((stock) => stock.investedValue),
                    label: 'Invested amount'
                },
                {
                    data: sorted.map((stock) => stock.currentValue),
                    label: 'Current value'
                }
            ];

            const xAxisData = [
                {
                    data: sorted.map((stock) => stock.symbol),
                    scaleType: 'band',
                    dataKey: 'symbol'
                }
            ];

            return {
                series: seriesData,
                xAxis: xAxisData
            };
        },
        [stocksInfo]
    );

    const chartSetting = {
        yAxis: [
            {
                label: 'Price'
            }
        ],
        sx: {
            [`.${axisClasses.left} .${axisClasses.label}`]: {
                transform: 'translate(-40px, 0)'
            }
        },
        borderRadius: 5,
        height: 350
    };
    const {series: totalProfitLossAscSeries, xAxis: totalProfitLossAscXAxis} = getTotalProfitLoss(SORT_ORDER.ASC);
    const {series: totalProfitLossDescSeries, xAxis: totalProfitLossDescXAxis} = getTotalProfitLoss(SORT_ORDER.DESC);

    const [advanced, declined] = stocksInfo.reduce(
        (acc, stock) => {
            if (stock.percentDayChange < 0) {
                acc = [acc[0], acc[1] + 1];
            } else {
                acc = [acc[0] + 1, acc[1]];
            }
            return acc;
        },
        [0, 0]
    );

    return {
        totalProfitLossAscSeries,
        totalProfitLossAscXAxis,
        totalProfitLossDescSeries,
        totalProfitLossDescXAxis,
        chartSetting,
        advanced,
        declined
    };
};
