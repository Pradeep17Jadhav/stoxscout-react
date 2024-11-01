import { authRequest, HttpMethod } from ".";

export const getIndices = async () => {
    try {
        const response = await authRequest('http://localhost:4000/api/indices', {
            method: HttpMethod.GET,
        });
        if (response.status === 401) {
            throw new Error('Unauthorized: You must be logged in to access market indices.');
        }
        if (response.status === 404) {
            throw new Error('Not Found: Market indices data not found.');
        }
        if (!response.ok) {
            throw new Error('Failed to retrieve market indices.');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};