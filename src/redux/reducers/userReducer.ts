import {HoldingSummary, SORT_ORDER, UserHoldings} from '../../types/transaction';
import {Preferences, DEFAULT_COLUMNS, THEME} from '../../types/userPreferences';
import {UserAction} from '../actions/userActions';

export type UserState = {
    name: string;
    holdingSummary: HoldingSummary;
    userHoldings: UserHoldings;
    preferences: Preferences;
};

export const initialState: UserState = {
    name: 'User',
    holdingSummary: {
        totalPnl: '0',
        totalInvestedValue: '0',
        totalCurrentValue: '0',
        totalPnlPercentage: '0',
        totalDayChange: '0',
        totalDayChangePercentage: '0'
    },
    userHoldings: {
        holdings: [],
        loaded: false
    },
    preferences: {
        theme: THEME.LIGHT,
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
        },
        loaded: false
    }
};

export const userReducer = (state: UserState = initialState, action: UserAction): UserState => {
    switch (action.type) {
        case 'UPDATE_USER_INFORMATION': {
            const userInfo = action.payload;
            return {...state, name: userInfo.name};
        }
        case 'UPDATE_HOLDING_SUMMARY':
            return {...state, holdingSummary: action.payload};
        case 'UPDATE_USER_HOLDINGS':
            return {
                ...state,
                userHoldings: {
                    ...state.userHoldings,
                    holdings: action.payload,
                    loaded: true
                }
            };
        case 'UPDATE_USER_PREFERENCES':
            return {
                ...state,
                preferences: {
                    ...state.preferences,
                    ...action.payload,
                    loaded: true
                }
            };
        case 'UPDATE_THEME_PREFERENCES':
            return {
                ...state,
                preferences: {
                    ...state.preferences,
                    theme: action.payload
                }
            };
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
        case 'UPDATE_MOBILE_DASHBOARD_VISIBLE_COLUMN_PREFERENCES':
            return {
                ...state,
                preferences: {
                    ...state.preferences,
                    mobile: {
                        ...state.preferences.mobile,
                        dashboard: {
                            ...state.preferences.mobile?.dashboard,
                            visibleColumns: action.payload
                        }
                    }
                }
            };
        default:
            return state;
    }
};
