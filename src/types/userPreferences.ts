import {Sort_Order} from './transaction';

export enum Default_Columns {
    SYMBOL = 'SYMBOL',
    QUANTITY = 'QUANTITY',
    AVG_PRICE = 'AVG PRICE',
    LTP = 'LTP',
    INVESTED_VALUE = 'INVESTED VALUE',
    CURRENT_VALUE = 'CURRENT VALUE',
    DAY_PNL = 'DAY P&L',
    DAY_PNL_PERCENT = 'DAY P&L %',
    DAY_PNL_PERCENT_INVESTMENT = 'DAY P&L % INV',
    NET_PNL = 'NET PNL',
    NET_PNL_PERCENT = 'NET PNL %',
    MAX_DAYS = 'MAX DAYS'
}

export type UserPreferences = {
    dashboardSort: {
        column: Default_Columns;
        sortOrder: Sort_Order;
    };
};
