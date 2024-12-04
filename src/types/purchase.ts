import dayjs from 'dayjs';

export type Purchase = {
    symbol: string;
    dateAdded: number;
    quantity: number;
    avgPrice: string;
    exchange?: string;
    isGift?: boolean;
    isIPO?: boolean;
};

export type LocalPurchaseTransaction = {
    id: number;
    dateAdded: dayjs.Dayjs;
    quantity: string;
    avgPrice: string;
    isGift: boolean;
    isIPO: boolean;
};

export type LocalPurchase = {
    symbol: string;
    transactions: LocalPurchaseTransaction[];
};
