import {Action, Dispatch} from 'redux';
import {ThunkAction} from '@reduxjs/toolkit';
import {updatePreference} from '../../api/userAPI';
import {Holdings, HoldingSummary} from '../../types/transaction';
import {DashboardPreferences, DEFAULT_COLUMNS, DevicePreferences, Preferences} from '../../types/userPreferences';
import {RootState} from '../reducers/rootReducer';

export type UserAction =
    | {type: 'UPDATE_HOLDING_SUMMARY'; payload: HoldingSummary}
    | {type: 'UPDATE_USER_HOLDINGS'; payload: Holdings}
    | {type: 'UPDATE_USER_PREFERENCES'; payload: Preferences}
    | {type: 'UPDATE_MOBILE_PREFERENCES'; payload: DevicePreferences}
    | {type: 'UPDATE_COMPUTER_PREFERENCES'; payload: DevicePreferences}
    | {type: 'UPDATE_MOBILE_DASHBOARD_PREFERENCES'; payload: DashboardPreferences}
    | {type: 'UPDATE_COMPUTER_DASHBOARD_PREFERENCES'; payload: DashboardPreferences}
    | {type: 'UPDATE_MOBILE_DASHBOARD_VISIBLE_COLUMN_PREFERENCES'; payload: DEFAULT_COLUMNS[]}
    | {type: 'UPDATE_COMPUTER_DASHBOARD_VISIBLE_COLUMN_PREFERENCES'; payload: DEFAULT_COLUMNS[]};

export const updateHoldingSummary = (payload: HoldingSummary): UserAction => ({
    type: 'UPDATE_HOLDING_SUMMARY',
    payload
});

export const updateUserHoldings = (payload: Holdings): UserAction => ({
    type: 'UPDATE_USER_HOLDINGS',
    payload
});

export const updateUserPreferences = (payload: Preferences): UserAction => ({
    type: 'UPDATE_USER_PREFERENCES',
    payload
});

export const updateMobilePreferences = (payload: DevicePreferences): UserAction => ({
    type: 'UPDATE_MOBILE_PREFERENCES',
    payload
});

export const updateComputerPreferences = (payload: DevicePreferences): UserAction => ({
    type: 'UPDATE_COMPUTER_PREFERENCES',
    payload
});

export const updateMobileDashboardPreferences = (payload: DashboardPreferences): UserAction => ({
    type: 'UPDATE_MOBILE_DASHBOARD_PREFERENCES',
    payload
});

export const updateComputerDashboardPreferences = (payload: DashboardPreferences): UserAction => ({
    type: 'UPDATE_COMPUTER_DASHBOARD_PREFERENCES',
    payload
});

export const updateComputerDashboardVisibleColumnPreferences = (payload: DEFAULT_COLUMNS[]): UserAction => ({
    type: 'UPDATE_COMPUTER_DASHBOARD_VISIBLE_COLUMN_PREFERENCES',
    payload
});

export const updateMobileDashboardVisibleColumnPreferences = (payload: DEFAULT_COLUMNS[]): UserAction => ({
    type: 'UPDATE_MOBILE_DASHBOARD_VISIBLE_COLUMN_PREFERENCES',
    payload
});

export const updateMobileDashboardPreferencesThunk = (
    newDashboardPreference: DashboardPreferences
): ThunkAction<Promise<void>, RootState, unknown, Action<string>> => {
    return async (dispatch: Dispatch<any>, getState: () => RootState) => {
        try {
            const currentPreferences = getState().user.preferences;
            const updatedPreferences = {
                ...currentPreferences,
                mobile: {
                    ...currentPreferences.mobile,
                    dashboard: newDashboardPreference
                }
            };
            await updatePreference(updatedPreferences);
            dispatch(updateMobileDashboardPreferences(newDashboardPreference));
        } catch (error) {
            console.error('Failed to update Dashboard preferences:', error);
        }
    };
};

export const updateComputerDashboardPreferencesThunk = (
    newDashboardPreference: DashboardPreferences
): ThunkAction<Promise<void>, RootState, unknown, Action<string>> => {
    return async (dispatch: Dispatch<any>, getState: () => RootState) => {
        try {
            const currentPreferences = getState().user.preferences;
            const updatedPreferences = {
                ...currentPreferences,
                computer: {
                    ...currentPreferences.computer,
                    dashboard: newDashboardPreference
                }
            };
            await updatePreference(updatedPreferences);

            dispatch(updateComputerDashboardPreferences(newDashboardPreference));
        } catch (error) {
            console.error('Failed to update Dashboard preferences:', error);
        }
    };
};

export const updatePreferencesOnlineThunk = (): ThunkAction<Promise<void>, RootState, unknown, Action<string>> => {
    return async (dispatch: Dispatch<any>, getState: () => RootState) => {
        try {
            const currentPreferences = getState().user.preferences;
            await updatePreference(currentPreferences);
        } catch (error) {
            console.error('Failed to update preferences:', error);
        }
    };
};
