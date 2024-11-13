import Box from '@mui/material/Box/Box';
import {HoldingSummary} from '../../types/transaction';
import {getProfitLossClassname} from '../../helpers/price';
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
                    <div className={getProfitLossClassname(holdingSummary.totalInvestedValue)}>
                        {holdingSummary.totalInvestedValue}
                    </div>
                </Box>
                <Box className="holdingInfoItem" sx={{display: {xs: 'none', sm: 'none', md: 'flex'}}}>
                    <span>Current</span>
                    <div className={getProfitLossClassname(holdingSummary.totalCurrentValue)}>
                        {holdingSummary.totalCurrentValue}
                    </div>
                </Box>
                <Box className="holdingInfoItem">
                    <span>P&L</span>
                    <div className={getProfitLossClassname(holdingSummary.totalPnl)}>
                        {holdingSummary.totalPnl} ({holdingSummary.totalPnlPercentage}%)
                    </div>
                </Box>
                <Box className="holdingInfoItem">
                    <span>Day P&L</span>
                    <div className={getProfitLossClassname(holdingSummary.totalDayChange)}>
                        {holdingSummary.totalDayChange} ({holdingSummary.totalDayChangePercentage}
                        %)
                    </div>
                </Box>
            </div>
        </div>
    );
};
