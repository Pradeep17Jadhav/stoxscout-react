import classnames from 'classnames';
import {formatPrice, getProfitLossClassname} from '../../../helpers/price';
import {StockInformation} from '../../../types/transaction';
import './styles.css';

type Props = {
    stockInfo: StockInformation;
};

export const HoldingsSummaryItem = ({stockInfo}: Props) => {
    const {
        symbol,
        quantity,
        avgPrice: avgPriceRaw,
        pnl: pnlRaw,
        pnlpercent: pnlpercentRaw,
        investedValue: investedValueRaw,
        ltp: ltpRaw,
        percentDayChange: percentDayChangeRaw
    } = stockInfo;
    const avgPrice = formatPrice(avgPriceRaw);
    const investedValue = formatPrice(investedValueRaw);
    const pnl = formatPrice(pnlRaw);
    const ltp = formatPrice(ltpRaw);
    const percentDayChange = percentDayChangeRaw.toFixed(2);
    const pnlpercent = pnlpercentRaw.toFixed(2);

    return (
        <div className="holding-summary-item">
            <div className="holding-summary-item-row">
                <span className="holding-summary-item-left">
                    <span>
                        <span>Qty.</span>
                        <span>{`${quantity} •`}</span>
                    </span>
                    <span>
                        <span>Avg.</span>
                        <span>{avgPrice}</span>
                    </span>
                </span>
                <span className="holding-summary-item-right">
                    <span className={classnames(getProfitLossClassname(pnlpercent, true))}>{pnlpercent}%</span>
                </span>
            </div>
            <div className="holding-summary-item-row main-text">
                <span className="holding-summary-item-left">{symbol}</span>
                <span className={classnames('holding-summary-item-right', getProfitLossClassname(pnl, true))}>
                    {pnl}
                </span>
            </div>

            <div className="holding-summary-item-row">
                <span className="holding-summary-item-left">
                    <span>Inv.</span>
                    <span>{investedValue}</span>
                </span>
                <span className="holding-summary-item-right">
                    <span>LTP</span>
                    <span>{ltp}</span>
                    <span
                        className={classnames(getProfitLossClassname(percentDayChange, true))}
                    >{`(${percentDayChange}%)`}</span>
                </span>
            </div>
        </div>
    );
};
