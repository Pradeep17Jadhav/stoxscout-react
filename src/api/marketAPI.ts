import { authRequest, HttpMethod } from ".";

export const getMarket = async () => {
    try {
        const response = await authRequest('http://localhost:4000/api/marketData', {
            method: HttpMethod.GET,
        });
        if (response.status === 401) {
            throw new Error('Unauthorized: You must be logged in to access market data.');
        }
        if (response.status === 404) {
            throw new Error('Not Found: Market data not found.');
        }
        if (!response.ok) {
            throw new Error('Failed to retrieve market data.');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};