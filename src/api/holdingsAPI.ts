import {Purchase} from '../types/purchase';
import {authRequest, HttpMethod} from '.';
import {endpoints} from './apiConfig';
import {EditableTransaction} from '../types/transaction';

export const getUserHoldings = async () => {
    const {response, data} = await authRequest(endpoints.holdings);
    if (response.status === 404) {
        throw new Error('Holdings not found.');
    }
    if (!response.ok) {
        throw new Error('Failed to retrieve holdings.');
    }
    return data;
};

export const addPurchase = async (purchase: Purchase) => {
    const {response, data} = await authRequest(endpoints.holdings, {
        method: HttpMethod.POST,
        body: purchase
    });
    if (response.status === 400) {
        throw new Error('Bad Request: Please check the purchase details.');
    }
    if (response.status === 404) {
        throw new Error('Not Found: The resource you are trying to access does not exist.');
    }
    if (!response.ok) {
        throw new Error('Failed to add purchase.');
    }
    return data;
};

export const bulkAddHoldings = async (holdings: Purchase[]) => {
    const {response, data} = await authRequest(endpoints.upload, {
        method: HttpMethod.POST,
        body: holdings
    });
    if (response.status === 400) {
        throw new Error('Bad Request: Please check the purchase details.');
    }
    if (response.status === 404) {
        throw new Error('Not Found: The resource you are trying to access does not exist.');
    }
    if (!response.ok) {
        throw new Error('Failed to add holdings.');
    }
    return data;
};

export const editHolding = async (symbol: string, updatedTransactions: EditableTransaction[]) => {
    const {response, data} = await authRequest(endpoints.editHolding, {
        method: HttpMethod.POST,
        body: {
            symbol,
            updatedTransactions
        }
    });
    if (response.status === 500) {
        if (data.message === 'incorrect_payload') {
            throw new Error('Bad Request: Please try again with correct details.');
        }
        throw new Error('Transaction update failed. Please try again.');
    }
    if (response.status === 404) {
        throw new Error('The holding you are trying to update does not exist.');
    }
    if (!response.ok) {
        throw new Error('Transaction update failed. Please try again.');
    }
    return data;
};
