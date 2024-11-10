import {BarChart as BC} from '@mui/x-charts/BarChart';
import {Bar} from 'recharts';

type Props = {
    series: any;
    xAxis: any;
    chartSetting: any;
};

export const BarChart = ({series, xAxis, chartSetting}: Props) => {
    return (
        <BC
            series={series}
            height={300}
            xAxis={xAxis}
            margin={{top: 10, bottom: 30, left: 100, right: 10}}
            {...chartSetting}
        ></BC>
    );
};
