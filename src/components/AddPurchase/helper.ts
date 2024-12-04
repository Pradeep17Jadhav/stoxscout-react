import dayjs from 'dayjs';

export const getDefaultLocalPurchase = () => ({
    symbol: '',
    transactions: [
        {
            id: new Date().getTime(),
            dateAdded: dayjs(new Date().toISOString().split('T')[0]),
            quantity: '',
            avgPrice: '',
            isGift: false,
            isIPO: false
        }
    ]
});
