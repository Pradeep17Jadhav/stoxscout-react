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
                    <span>Investment</span>
                    <div className={parseInt(holdingSummary.totalInvestedValue) >= 0 ? 'profit' : 'loss'}>
                        {holdingSummary.totalInvestedValue}
                    </div>
                </Box>
                <Box className="holdingInfoItem" sx={{display: {xs: 'none', sm: 'none', md: 'flex'}}}>
                    <span>Current</span>
                    <div className={parseInt(holdingSummary.totalCurrentValue) >= 0 ? 'profit' : 'loss'}>
                        {holdingSummary.totalCurrentValue}
                    </div>
                </Box>
                <Box className="holdingInfoItem">
                    <span>P&L</span>
                    <div className={parseInt(holdingSummary.totalPnl) >= 0 ? 'profit' : 'loss'}>
                        {holdingSummary.totalPnl} ({holdingSummary.totalPnlPercentage}%)
                    </div>
                </Box>
                <Box className="holdingInfoItem">
                    <span>Day P&L</span>
                    <div className={parseInt(holdingSummary.totalDayChange) >= 0 ? 'profit' : 'loss'}>
                        {holdingSummary.totalDayChange} ({holdingSummary.totalDayChangePercentage}
                        %)
                    </div>
                </Box>
            </div>
        </div>
    );
};
