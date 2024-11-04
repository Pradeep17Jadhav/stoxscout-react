import {Holdings, HoldingSummary} from '../../types/transaction';

export type UserAction =
    | {type: 'UPDATE_HOLDING_SUMMARY'; payload: HoldingSummary}
    | {type: 'UPDATE_USER_HOLDINGS'; payload: Holdings};

export const updateHoldingSummary = (payload: HoldingSummary): UserAction => ({
    type: 'UPDATE_HOLDING_SUMMARY',
    payload
});

export const updateUserHoldings = (payload: Holdings): UserAction => ({
    type: 'UPDATE_USER_HOLDINGS',
    payload
});
