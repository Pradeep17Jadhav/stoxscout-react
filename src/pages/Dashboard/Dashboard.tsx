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
import './styles.css';

export const Dashboard = () => {
    const [isDayView, setIsDayView] = useState(true);
    const {stocksInfo} = usePortfolio();
    const {
        chartSetting,
        todaysTopFiveList,
        totalProfitLossAscSeries,
        totalProfitLossAscXAxis,
        totalProfitLossDescSeries,
        totalProfitLossDescXAxis,
        advanced,
        declined
    } = useChartsData();

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
                <Paper className="widget">
                    {generateWidgetTitle('Top Gainers')}
                    <HoldingTable
                        stocksInfo={todaysTopFiveList.gainers}
                        visibleColumns={isMobile ? [1, 4, 9, 10] : [1, 3, 4, 9, 10]}
                    />
                </Paper>
                <Paper className="widget">
                    {generateWidgetTitle('Top Losers')}
                    <HoldingTable
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
        [advanced, declined, generateWidgetTitle, todaysTopFiveList.gainers, todaysTopFiveList.losers]
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
