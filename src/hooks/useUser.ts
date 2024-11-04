import {useDispatch, useSelector} from 'react-redux';
import {PortfolioAction} from '../redux/actions/portfolioActions';
import {UserState} from '../redux/reducers/userReducer';
import {RootState} from '../redux/reducers/rootReducer';

type UseUserType = UserState & {
    dispatch: React.Dispatch<PortfolioAction>;
};

export const useUser = (): UseUserType => {
    const dispatch = useDispatch();
    const state: UserState = useSelector((state: RootState) => state.user);
    return {...state, dispatch};
};
