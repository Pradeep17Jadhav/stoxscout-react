import {HoldingSummary, Holdings, SORT_ORDER} from '../../types/transaction';
import {Preferences, DEFAULT_COLUMNS} from '../../types/userPreferences';
import {UserAction} from '../actions/userActions';

export type UserState = {
    holdingSummary: HoldingSummary;
    userHoldings: Holdings;
    preferences: Preferences;
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
    preferences: {
        mobile: {
            dashboard: {
                visibleColumns: [1, 2, 4, 10],
                sortColumn: DEFAULT_COLUMNS.SYMBOL,
                sortOrder: SORT_ORDER.ASC
            }
        },
        computer: {
            dashboard: {
                visibleColumns: Object.values(DEFAULT_COLUMNS).filter((value) => typeof value === 'number') as [],
                sortColumn: DEFAULT_COLUMNS.SYMBOL,
                sortOrder: SORT_ORDER.ASC
            }
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
            return {...state, preferences: action.payload};
        case 'UPDATE_COMPUTER_DASHBOARD_PREFERENCES':
            return {
                ...state,
                preferences: {
                    ...state.preferences,
                    computer: {
                        ...state.preferences.computer,
                        dashboard: action.payload
                    }
                }
            };
        case 'UPDATE_COMPUTER_DASHBOARD_VISIBLE_COLUMN_PREFERENCES':
            return {
                ...state,
                preferences: {
                    ...state.preferences,
                    computer: {
                        ...state.preferences.computer,
                        dashboard: {
                            ...state.preferences.computer?.dashboard,
                            visibleColumns: action.payload
                        }
                    }
                }
            };
        default:
            return state;
    }
};
