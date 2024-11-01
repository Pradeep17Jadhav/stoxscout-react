export type MarketData = StockData[];

type StockData = {
    symbol: string,
    lastPrice: number,
    change: number,
    pChange: number,
    previousClose: number,
    open: number,
    close: number,
    basePrice: number,
}