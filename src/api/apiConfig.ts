const API_URL = process.env.API_BASE_URL || 'http://localhost:4000';

const endpoints = {
    holdings: `${API_URL}/api/holdings`,
    market: `${API_URL}/api/market`,
    indices: `${API_URL}/api/indices`,
    userData: `${API_URL}/api/userData`,
    login: `${API_URL}/api/login`,
    logout: `${API_URL}/api/logout`,
} as const;

type Endpoints = typeof endpoints;

export { endpoints };
export type { Endpoints };