import {useDispatch, useSelector} from 'react-redux';
import {initialState as initPortfolioState, PortfolioState} from '../redux/reducers/portfolioReducer';
import {RootState} from '../redux/reducers/rootReducer';
import {PortfolioAction} from '../redux/actions/portfolioActions';

type UsePortfolioType = typeof initPortfolioState & {
    dispatch: React.Dispatch<PortfolioAction>;
};

export const usePortfolio = (): UsePortfolioType => {
    const dispatch = useDispatch();
    const state: PortfolioState = useSelector((state: RootState) => state.portfolio);
    return {...state, dispatch};
};
