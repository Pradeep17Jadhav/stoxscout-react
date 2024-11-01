export const isMarketTime = () => {
    const now = new Date();
    const start = new Date();
    const end = new Date();
    start.setHours(9, 0, 0);
    end.setHours(15, 30, 0);
    return now >= start && now <= end;
};
