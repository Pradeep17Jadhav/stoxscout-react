import { authRequest, HttpMethod } from '.';
import { endpoints } from './apiConfig';

export const getIndices = async () => {
    const response = await authRequest(endpoints.indices, {
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
};