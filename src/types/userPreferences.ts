import {SORT_ORDER} from './transaction';

export enum DEFAULT_COLUMNS {
    SYMBOL = 1,
    QUANTITY = 2,
    AVG_PRICE = 3,
    LTP = 4,
    INVESTED_VALUE = 5,
    CURRENT_VALUE = 6,
    NET_PNL = 7,
    NET_PNL_PERCENT = 8,
    DAY_PNL = 9,
    DAY_PNL_PERCENT = 10,
    DAY_PNL_PERCENT_INV = 11,
    MAX_DAYS = 12
}

export type DashboardPreferences = {
    visibleColumns?: DEFAULT_COLUMNS[];
    sortColumn?: DEFAULT_COLUMNS;
    sortOrder?: SORT_ORDER;
};

export type DevicePreferences = {
    dashboard?: DashboardPreferences;
};

export type Preferences = {
    mobile?: DevicePreferences;
    computer?: DevicePreferences;
    loaded: boolean;
};
