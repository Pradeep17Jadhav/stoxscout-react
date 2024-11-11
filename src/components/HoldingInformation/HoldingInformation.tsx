import Box from '@mui/material/Box/Box';
import {HoldingSummary} from '../../types/transaction';
import './styles.css';

type Props = {
    holdingSummary: HoldingSummary;
};

export const HoldingInformation = ({holdingSummary}: Props) => {
    return (
        <div className="holdingInfo-container">
            <div className="holdingInfo">
                <Box className="holdingInfoItem">
                    <div>Investment</div>
                    <div className={parseInt(holdingSummary.totalInvestedValue) >= 0 ? 'profit' : 'loss'}>
                        {holdingSummary.totalInvestedValue}
                    </div>
                </Box>
                <Box className="holdingInfoItem" sx={{display: {xs: 'none', sm: 'none', md: 'flex'}}}>
                    <div>Current</div>
                    <div className={parseInt(holdingSummary.totalCurrentValue) >= 0 ? 'profit' : 'loss'}>
                        {holdingSummary.totalCurrentValue}
                    </div>
                </Box>
                <Box className="holdingInfoItem">
                    <div>P&L</div>
                    <div className={parseInt(holdingSummary.totalPnl) >= 0 ? 'profit' : 'loss'}>
                        {holdingSummary.totalPnl} ({holdingSummary.totalPnlPercentage}%)
                    </div>
                </Box>
                <Box className="holdingInfoItem">
                    <div>Day P&L</div>
                    <div className={parseInt(holdingSummary.totalDayChange) >= 0 ? 'profit' : 'loss'}>
                        {holdingSummary.totalDayChange} ({holdingSummary.totalDayChangePercentage}
                        %)
                    </div>
                </Box>
            </div>
        </div>
    );
};
