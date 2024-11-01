import { HoldingSummary } from "../../types/transaction";

type Props = {
  holdingSummary: HoldingSummary;
};

export const HoldingInformation = ({ holdingSummary }: Props) => {
  return (
    <div className="holdingInfo">
      <div className="holdingInfoItem">
        <div>Total Investment</div>
        <div
          className={
            parseInt(holdingSummary.totalInvestedValue) >= 0 ? "profit" : "loss"
          }
        >
          {holdingSummary.totalInvestedValue}
        </div>
      </div>
      <div className="holdingInfoItem">
        <div>Current Value</div>
        <div
          className={
            parseInt(holdingSummary.totalCurrentValue) >= 0 ? "profit" : "loss"
          }
        >
          {holdingSummary.totalCurrentValue}
        </div>
      </div>
      <div className="holdingInfoItem">
        <div>Day's P&L</div>
        <div
          className={
            parseInt(holdingSummary.totalDayChange) >= 0 ? "profit" : "loss"
          }
        >
          {holdingSummary.totalDayChange} ({holdingSummary.totalDayChangePercentage}
          %)
        </div>
      </div>
      <div className="holdingInfoItem">
        <div>Total P&L</div>
        <div
          className={parseInt(holdingSummary.totalPnl) >= 0 ? "profit" : "loss"}
        >
          {holdingSummary.totalPnl} ({holdingSummary.totalPnlPercentage}%)
        </div>
      </div>
    </div>
  );
};
