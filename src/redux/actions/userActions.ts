import {Holdings, HoldingSummary} from '../../types/transaction';
import {UserPreferences} from '../../types/userPreferences';

export type UserAction =
    | {type: 'UPDATE_HOLDING_SUMMARY'; payload: HoldingSummary}
    | {type: 'UPDATE_USER_HOLDINGS'; payload: Holdings}
    | {type: 'UPDATE_USER_PREFERENCES'; payload: UserPreferences};

export const updateHoldingSummary = (payload: HoldingSummary): UserAction => ({
    type: 'UPDATE_HOLDING_SUMMARY',
    payload
});

export const updateUserHoldings = (payload: Holdings): UserAction => ({
    type: 'UPDATE_USER_HOLDINGS',
    payload
});

export const updateUserPreferences = (payload: UserPreferences): UserAction => ({
    type: 'UPDATE_USER_PREFERENCES',
    payload
});
