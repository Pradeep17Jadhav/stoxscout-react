import {useCallback, useMemo, useState} from 'react';
import {isMobile} from 'react-device-detect';
import {BarChart} from '../../components/Charts/BarChart/BarChart';
import {usePortfolio} from '../../hooks/usePortfolio';
import {useChartsData} from '../../hooks/useCharts';
import Typography from '@mui/material/Typography/Typography';
import {PieChart} from '@mui/x-charts/PieChart';
import {HoldingTable} from '../../components/HoldingTable/HoldingTable';
import Grid from '@mui/material/Grid/Grid';
import Paper from '@mui/material/Paper/Paper';
import Stack from '@mui/material/Stack/Stack';
import Switch from '@mui/material/Switch/Switch';
import {useUser} from '../../hooks/useUser';
import {formatPrice} from '../../helpers/price';
import './styles.css';

export const Dashboard = () => {
    const [isDayView, setIsDayView] = useState(true);
    const {holdingSummary} = useUser();
    const {stocksInfo} = usePortfolio();
    const {
        chartSetting,
        todaysTopFiveList,
        totalProfitLossAscSeries,
        totalProfitLossAscXAxis,
        totalProfitLossDescSeries,
        totalProfitLossDescXAxis,
        advanced,
        declined,
        bullsVsBears
    } = useChartsData();
    const {holdings} = useUser();

    const generateWidgetTitle = useCallback(
        (title: string) => (
            <Typography className="widget-title" variant="h6" gutterBottom>
                {title}
            </Typography>
        ),
        []
    );

    const switchHandler = useCallback(() => setIsDayView((isDayView) => !isDayView), []);

    const dayWidgets = useMemo(
        () => (
            <>
                <Paper className="widget-small">
                    {generateWidgetTitle('Money Flow')}
                    {'Today bulls made Rs. '}
                    <span className="profit">{bullsVsBears.bulls}</span>
                    {' for you! However, bears took away Rs. '}
                    <span className="loss">{bullsVsBears.bears}</span>
                    {` from you. In total, you ${bullsVsBears.hasProfit ? 'gained' : 'lost'} Rs. `}
                    <span className={bullsVsBears.hasProfit ? 'profit' : 'loss'}>{holdingSummary.totalDayChange}</span>
                    {', which is '}
                    <span className={bullsVsBears.hasProfit ? 'profit' : 'loss'}>
                        {holdingSummary.totalDayChangePercentage}%
                    </span>
                    {' of your porfolio.'}
                </Paper>
                <Paper className="widget-small">
                    {generateWidgetTitle('Advance Decline Ratio')}
                    {`Out of ${advanced + declined} stocks you own, `}
                    <span className="profit">{advanced}</span>
                    {' stocks were positive today. The rest '}
                    <span className="loss">{declined}</span>
                    {' stocks you own, closed with a loss.'}
                </Paper>
                <Paper className="widget-small">
                    {generateWidgetTitle('Top Gainer and Top Looser')}
                    {`Your stock ${todaysTopFiveList.gainers[0].symbol} made an impressive profit of Rs. `}
                    <span className="profit">{`${formatPrice(todaysTopFiveList.gainers[0].totalDayChange)} (${todaysTopFiveList.gainers[0].percentDayChange.toFixed(2)}%)`}</span>
                    {` today. On the other hand, ${todaysTopFiveList.losers[0].symbol} made a loss or Rs. `}
                    <span className="loss">{`${formatPrice(todaysTopFiveList.losers[0].totalDayChange)} (${todaysTopFiveList.losers[0].percentDayChange.toFixed(2)}%)`}</span>
                    {'.'}
                </Paper>
                <Paper className="widget">
                    {generateWidgetTitle('Top Gainers')}
                    <HoldingTable
                        stocksInfo={todaysTopFiveList.gainers}
                        holdings={holdings}
                        visibleColumns={isMobile ? [1, 4, 9, 10] : [1, 3, 4, 9, 10]}
                    />
                </Paper>
                <Paper className="widget">
                    {generateWidgetTitle('Top Losers')}
                    <HoldingTable
                        holdings={holdings}
                        stocksInfo={todaysTopFiveList.losers}
                        visibleColumns={isMobile ? [1, 4, 9, 10] : [1, 3, 4, 9, 10]}
                    />
                </Paper>

                <Paper className="widget">
                    {generateWidgetTitle('Advance Decline Ratio')}
                    <PieChart
                        series={[
                            {
                                data: [
                                    {id: 0, value: advanced, label: 'Advanced', color: '#10b983'},
                                    {id: 1, value: declined, label: 'Declined', color: '#f35631'}
                                ]
                            }
                        ]}
                        width={400}
                        height={360}
                    />
                </Paper>
            </>
        ),
        [
            advanced,
            bullsVsBears.bears,
            bullsVsBears.bulls,
            bullsVsBears.hasProfit,
            declined,
            generateWidgetTitle,
            holdingSummary.totalDayChange,
            holdingSummary.totalDayChangePercentage,
            holdings,
            todaysTopFiveList.gainers,
            todaysTopFiveList.losers
        ]
    );

    return stocksInfo.length ? (
        <>
            <Stack direction="row" spacing={1} sx={{alignItems: 'center', marginLeft: '32px'}}>
                <Typography>Daily</Typography>
                <Switch value={isDayView} onChange={switchHandler} />
                <Typography>Overall</Typography>
            </Stack>
            <Grid container justifyContent="center" alignItems="center">
                {isDayView ? (
                    dayWidgets
                ) : (
                    <>
                        <Paper className="widget">
                            {generateWidgetTitle('Top Gainers (Total profit in Rupees)')}
                            <BarChart
                                series={totalProfitLossDescSeries}
                                xAxis={totalProfitLossDescXAxis}
                                chartSetting={chartSetting}
                            />
                        </Paper>
                        <Paper className="widget">
                            {generateWidgetTitle('Top Losers (Total loss in Rupees)')}
                            <BarChart
                                series={totalProfitLossAscSeries}
                                xAxis={totalProfitLossAscXAxis}
                                chartSetting={chartSetting}
                            />
                        </Paper>
                    </>
                )}
            </Grid>
        </>
    ) : (
        <></>
    );
};
