export const getUpdatedAgo = (timestamp: string | undefined) => {
    if (!timestamp) {
        return 'long time';
    }
    const now = new Date();
    const pastDate = new Date(timestamp);
    const diff = now.getTime() - pastDate.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
        return `${seconds}s`;
    } else if (minutes < 60) {
        return `${minutes}m`;
    } else if (hours < 24) {
        return `${hours}h`;
    } else if (days < 30) {
        return `${days}d`;
    } else if (months < 12) {
        return `${months}mo`;
    } else {
        return `${years}y`;
    }
};

export const getFormattedDate = (date: string) => {
    const split = date.split('-');
    let month;
    if (split.length === 2) {
        month = parseInt(split[0]);
    } else if (split.length === 3) {
        month = parseInt(split[1]);
    }
    let monthName: string;
    if (month === 1) {
        monthName = 'January';
    } else if (month === 2) {
        monthName = 'February';
    } else if (month === 3) {
        monthName = 'March';
    } else if (month === 4) {
        monthName = 'April';
    } else if (month === 5) {
        monthName = 'May';
    } else if (month === 6) {
        monthName = 'June';
    } else if (month === 7) {
        monthName = 'July';
    } else if (month === 8) {
        monthName = 'August';
    } else if (month === 9) {
        monthName = 'September';
    } else if (month === 10) {
        monthName = 'October';
    } else if (month === 11) {
        monthName = 'November';
    } else if (month === 12) {
        monthName = 'December';
    } else {
        return 'Invalid month';
    }
    if (split.length === 2) {
        return `${monthName} ${split[1]}`;
    }
    return `${getFormattedDateWithSuffix(parseInt(split[0]))} ${monthName} ${split[2]}`;
};

export const getFormattedDateWithSuffix = (day: number): string => {
    let suffix: string;
    if (day === 1 || day === 21 || day === 31) {
        suffix = 'st';
    } else if (day === 2 || day === 22) {
        suffix = 'nd';
    } else if (day === 3 || day === 23) {
        suffix = 'rd';
    } else {
        suffix = 'th';
    }
    return `${day}${suffix}`;
};
