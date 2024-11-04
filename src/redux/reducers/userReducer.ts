import {HoldingSummary, Holdings} from '../../types/transaction';
import {UserAction} from '../actions/userActions';

export type UserState = {
    holdingSummary: HoldingSummary;
    userHoldings: Holdings;
};

export const initialState: UserState = {
    holdingSummary: {
        totalPnl: '0',
        totalInvestedValue: '0',
        totalCurrentValue: '0',
        totalPnlPercentage: '0',
        totalDayChange: '0',
        totalDayChangePercentage: '0'
    },
    userHoldings: []
};

export const userReducer = (state: UserState = initialState, action: UserAction): UserState => {
    switch (action.type) {
        case 'UPDATE_HOLDING_SUMMARY':
            return {...state, holdingSummary: action.payload};
        case 'UPDATE_USER_HOLDINGS':
            return {...state, userHoldings: action.payload};
        default:
            return state;
    }
};
