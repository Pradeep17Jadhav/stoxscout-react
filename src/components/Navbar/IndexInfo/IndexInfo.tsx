import { Index } from "../../../types/indices"
import './styles.css';

type Props = {
    index: Index
}
export const IndexInfo = ({ index }: Props) => {
    const isNegative = index.percentChange < 0 ? true : false;
    return (
        <div className="index-container">
            <div>{index.indexSymbol}</div>
            <div className={`index-value' ${isNegative ? 'loss' : 'profit'}`}>{index.current} ({index.percentChange}%)</div>
        </div>
    )
}