import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/reducers/rootReducer';
import {AppState} from '../redux/reducers/appReducer';
import {setIsLoading} from '../redux/actions/appActions';

export const useApp = () => {
    const dispatch = useDispatch();
    const state: AppState = useSelector((state: RootState) => state.app);

    return {dispatch, isLoading: state.isLoading, setIsLoading};
};
