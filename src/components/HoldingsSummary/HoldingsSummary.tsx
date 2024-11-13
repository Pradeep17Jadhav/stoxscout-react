import classnames from 'classnames';
import {getProfitLossClassname} from '../../helpers/price';
import {sort} from '../../helpers/sort';
import {usePortfolio} from '../../hooks/usePortfolio';
import {useUser} from '../../hooks/useUser';
import {SORT_ORDER} from '../../types/transaction';
import {DEFAULT_COLUMNS} from '../../types/userPreferences';
import {HoldingsSummaryItem} from './HoldingSummaryItem/HoldingsSummaryItem';
import './styles.css';

export const HoldingsSummary = () => {
    const {stocksInfo} = usePortfolio();
    const {holdingSummary} = useUser();

    const sortedStockInfo = sort(stocksInfo, DEFAULT_COLUMNS.DAY_PNL_PERCENT, SORT_ORDER.ASC);
    return (
        <div className="holdings-summary">
            <div className="pnl-top-banner">
                <div className="pnl-banner-row">
                    <span>Invested</span>
                    <span>Current</span>
                </div>
                <div className="pnl-banner-row main-text">
                    <span>{holdingSummary.totalInvestedValue}</span>
                    <span>{holdingSummary.totalCurrentValue}</span>
                </div>
                <div className="pnl-banner-row price">
                    <span>P&L</span>
                    <span className="price-value">
                        <span className={getProfitLossClassname(holdingSummary.totalPnl, true)}>
                            {`${parseFloat(holdingSummary.totalPnl) >= 0 ? '+' : ''}${holdingSummary.totalPnl}`}
                        </span>
                        <span
                            className={classnames(
                                'pnl-banner-percent',
                                parseFloat(holdingSummary.totalPnl) >= 0 ? 'profit' : 'loss',
                                getProfitLossClassname(holdingSummary.totalPnlPercentage, true)
                            )}
                        >
                            {`${holdingSummary.totalPnlPercentage}%`}
                        </span>
                    </span>
                </div>
            </div>
            {sortedStockInfo.map((stockInfo) => (
                <HoldingsSummaryItem key={stockInfo.symbol} stockInfo={stockInfo} />
            ))}
            <div className="holding-summary-day-pnl-strip">
                <span>Day&apos;s P&L</span>
                <span className={getProfitLossClassname(holdingSummary.totalDayChange, true)}>
                    <span>{holdingSummary.totalDayChange}</span>
                    <span className="percentage">{`${holdingSummary.totalDayChangePercentage}%`}</span>
                </span>
            </div>
        </div>
    );
};
