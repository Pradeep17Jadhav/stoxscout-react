import {BarChart} from '../../components/Charts/BarChart/BarChart';
import {usePortfolio} from '../../hooks/usePortfolio';
import {useChartsData} from '../../hooks/useCharts';
import Typography from '@mui/material/Typography/Typography';
import {PieChart} from '@mui/x-charts/PieChart';
import './styles.css';

export const Dashboard = () => {
    const {stocksInfo} = usePortfolio();
    const {
        chartSetting,
        totalProfitLossAscSeries,
        totalProfitLossAscXAxis,
        totalProfitLossDescSeries,
        totalProfitLossDescXAxis,
        advanced,
        declined
    } = useChartsData();

    return stocksInfo.length ? (
        <div>
            <div className="chart-row">
                <div className="chart topGainsBarChart">
                    <Typography className="chart-title" variant="h6" gutterBottom>
                        Top Gainers (Total profit in Rupees)
                    </Typography>
                    <BarChart
                        series={totalProfitLossDescSeries}
                        xAxis={totalProfitLossDescXAxis}
                        chartSetting={chartSetting}
                    />
                </div>
                <div className="chart topLossesBarChart">
                    <Typography className="chart-title" variant="h6" gutterBottom>
                        Top Losers (Total loss in Rupees)
                    </Typography>
                    <BarChart
                        series={totalProfitLossAscSeries}
                        xAxis={totalProfitLossAscXAxis}
                        chartSetting={chartSetting}
                    />
                </div>
            </div>
            <div className="chart">
                <Typography className="chart-title" variant="h6" gutterBottom>
                    Advance Decline Ratio
                </Typography>
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
                    height={200}
                />
            </div>
        </div>
    ) : (
        <></>
    );
};
