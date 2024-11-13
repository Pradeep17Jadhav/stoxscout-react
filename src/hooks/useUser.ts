import {useDispatch, useSelector} from 'react-redux';
import {PortfolioAction} from '../redux/actions/portfolioActions';
import {UserState} from '../redux/reducers/userReducer';
import {RootState} from '../redux/reducers/rootReducer';
import {HoldingSummary, Holdings} from '../types/transaction';
import {Preferences} from '../types/userPreferences';
import {useMemo} from 'react';

type UseUserType = {
    dispatch: React.Dispatch<PortfolioAction>;
    name: string;
    holdingSummary: HoldingSummary;
    holdings: Holdings;
    preferences: Preferences;
    isUserLoaded: boolean;
};

export const useUser = (): UseUserType => {
    const dispatch = useDispatch();
    const state: UserState = useSelector((state: RootState) => state.user);

    const isUserLoaded = useMemo(
        () => state.userHoldings.loaded && state.preferences.loaded,
        [state.preferences.loaded, state.userHoldings.loaded]
    );
    return {
        dispatch,
        name: state.name || 'User',
        holdingSummary: state.holdingSummary,
        holdings: state.userHoldings.holdings,
        preferences: state.preferences,
        isUserLoaded
    };
};
