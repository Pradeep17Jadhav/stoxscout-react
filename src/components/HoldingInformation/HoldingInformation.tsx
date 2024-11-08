import {HoldingSummary} from '../../types/transaction';
import './styles.css';

type Props = {
    holdingSummary: HoldingSummary;
};

export const HoldingInformation = ({holdingSummary}: Props) => {
    return (
        <div className="holdingInfo-container">
            <div className="holdingInfo">
                <div className="holdingInfoItem">
                    <div>Investment</div>
                    <div className={parseInt(holdingSummary.totalInvestedValue) >= 0 ? 'profit' : 'loss'}>
                        {holdingSummary.totalInvestedValue}
                    </div>
                </div>
                <div className="holdingInfoItem">
                    <div>Current</div>
                    <div className={parseInt(holdingSummary.totalCurrentValue) >= 0 ? 'profit' : 'loss'}>
                        {holdingSummary.totalCurrentValue}
                    </div>
                </div>
                <div className="holdingInfoItem">
                    <div>P&L</div>
                    <div className={parseInt(holdingSummary.totalPnl) >= 0 ? 'profit' : 'loss'}>
                        {holdingSummary.totalPnl} ({holdingSummary.totalPnlPercentage}%)
                    </div>
                </div>
                <div className="holdingInfoItem">
                    <div>Day P&L</div>
                    <div className={parseInt(holdingSummary.totalDayChange) >= 0 ? 'profit' : 'loss'}>
                        {holdingSummary.totalDayChange} ({holdingSummary.totalDayChangePercentage}
                        %)
                    </div>
                </div>
            </div>
        </div>
    );
};
