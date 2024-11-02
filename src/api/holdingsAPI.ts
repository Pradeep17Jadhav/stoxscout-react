import {Purchase} from '../types/purchase';
import {authRequest, HttpMethod} from '.';
import {endpoints} from './apiConfig';

export const getUserHoldings = async () => {
    const response = await authRequest(endpoints.holdings);
    if (response.status === 401) {
        throw new Error('Unauthorized: You must be logged in.');
    }
    if (response.status === 404) {
        throw new Error('Holdings not found.');
    }
    if (!response.ok) {
        throw new Error('Failed to retrieve holdings.');
    }
    return await response.json();
};

export const addPurchase = async (purchase: Purchase) => {
    const response = await authRequest(endpoints.holdings, {
        method: HttpMethod.POST,
        body: purchase
    });
    if (response.status === 400) {
        throw new Error('Bad Request: Please check the purchase details.');
    }
    if (response.status === 401) {
        throw new Error('Unauthorized: You must be logged in to make a purchase.');
    }
    if (response.status === 404) {
        throw new Error('Not Found: The resource you are trying to access does not exist.');
    }
    if (!response.ok) {
        throw new Error('Failed to add purchase.');
    }
    return await response.json();
};
