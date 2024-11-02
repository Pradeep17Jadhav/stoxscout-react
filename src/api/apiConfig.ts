const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';

const endpoints = {
    register: `${API_URL}/api/register`,
    login: `${API_URL}/api/login`,
    logout: `${API_URL}/api/logout`,
    holdings: `${API_URL}/api/holdings`,
    market: `${API_URL}/api/market`,
    indices: `${API_URL}/api/indices`,
    userData: `${API_URL}/api/userData`
} as const;

type Endpoints = typeof endpoints;

export {endpoints};
export type {Endpoints};
