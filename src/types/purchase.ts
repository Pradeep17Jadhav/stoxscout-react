export type Purchase = {
    symbol: string;
    dateAdded: number;
    quantity: number;
    avgPrice: string;
    exchange?: string;
    isGift?: boolean;
    isIPO?: boolean;
};
