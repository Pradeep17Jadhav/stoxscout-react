import { HoldingSummary } from "../../types/transaction";

type Props = {
  holdingInfo: HoldingSummary;
};

export const HoldingInformation = ({ holdingInfo }: Props) => {
  return (
    <div className="holdingInfo">
      <div className="holdingInfoItem">
        <div>Total Investment</div>
        <div
          className={
            parseInt(holdingInfo.totalInvestedValue) >= 0 ? "profit" : "loss"
          }
        >
          {holdingInfo.totalInvestedValue}
        </div>
      </div>
      <div className="holdingInfoItem">
        <div>Current Value</div>
        <div
          className={
            parseInt(holdingInfo.totalCurrentValue) >= 0 ? "profit" : "loss"
          }
        >
          {holdingInfo.totalCurrentValue}
        </div>
      </div>
      <div className="holdingInfoItem">
        <div>Day's P&L</div>
        <div
          className={
            parseInt(holdingInfo.totalDayChange) >= 0 ? "profit" : "loss"
          }
        >
          {holdingInfo.totalDayChange} ({holdingInfo.totalDayChangePercentage}
          %)
        </div>
      </div>
      <div className="holdingInfoItem">
        <div>Total P&L</div>
        <div
          className={parseInt(holdingInfo.totalPnl) >= 0 ? "profit" : "loss"}
        >
          {holdingInfo.totalPnl} ({holdingInfo.totalPnlPercentage}%)
        </div>
      </div>
    </div>
  );
};
