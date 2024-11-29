export enum PORTFOLIO_VIEW {
    FULL = 1,
    BY_DATE = 2,
    BY_MONTH = 3,
    BY_YEAR = 4
}

export const PORTFOLIO_VIEW_NAMES = {
    [PORTFOLIO_VIEW.FULL]: 'Full',
    [PORTFOLIO_VIEW.BY_DATE]: 'By Date',
    [PORTFOLIO_VIEW.BY_MONTH]: 'By Month',
    [PORTFOLIO_VIEW.BY_YEAR]: 'By Year'
};
