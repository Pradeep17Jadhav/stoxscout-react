import {Holdings, HoldingSummary} from '../../types/transaction';
import {DashboardPreferences, DevicePreferences, Preferences} from '../../types/userPreferences';

export type UserAction =
    | {type: 'UPDATE_HOLDING_SUMMARY'; payload: HoldingSummary}
    | {type: 'UPDATE_USER_HOLDINGS'; payload: Holdings}
    | {type: 'UPDATE_USER_PREFERENCES'; payload: Preferences}
    | {type: 'UPDATE_MOBILE_PREFERENCES'; payload: DevicePreferences}
    | {type: 'UPDATE_COMPUTER_PREFERENCES'; payload: DevicePreferences}
    | {type: 'UPDATE_MOBILE_DASHBOARD_PREFERENCES'; payload: DashboardPreferences}
    | {type: 'UPDATE_COMPUTER_DASHBOARD_PREFERENCES'; payload: DashboardPreferences};

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
