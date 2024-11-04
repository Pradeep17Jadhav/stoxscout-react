import {HoldingSummary, Holdings, Sort_Order} from '../../types/transaction';
import {UserPreferences, Default_Columns} from '../../types/userPreferences';
import {UserAction} from '../actions/userActions';

export type UserState = {
    holdingSummary: HoldingSummary;
    userHoldings: Holdings;
    userPreferences: UserPreferences;
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
    userHoldings: [],
    userPreferences: {
        dashboardSort: {
            column: Default_Columns.SYMBOL,
            sortOrder: Sort_Order.DESC
        }
    }
};

export const userReducer = (state: UserState = initialState, action: UserAction): UserState => {
    switch (action.type) {
        case 'UPDATE_HOLDING_SUMMARY':
            return {...state, holdingSummary: action.payload};
        case 'UPDATE_USER_HOLDINGS':
            return {...state, userHoldings: action.payload};
        case 'UPDATE_USER_PREFERENCES':
            return {...state, userPreferences: action.payload};
        default:
            return state;
    }
};
