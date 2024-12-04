import {authRequest, HttpMethod, request} from '.';
import {endpoints} from './apiConfig';

export const getMarket = async () => {
    const {response, data} = await authRequest(endpoints.market, {
        method: HttpMethod.GET
    });
    if (response.status === 404) {
        throw new Error('Not Found: Market data not found.');
    }
    if (!response.ok) {
        throw new Error('Failed to retrieve market data.');
    }
    return data;
};

export const getHoldingsList = async () => {
    const {response, data} = await request(endpoints.holdingsList, {
        method: HttpMethod.GET
    });
    if (response.status === 404) {
        throw new Error('Not Found: Holding list not found.');
    }
    if (!response.ok) {
        throw new Error('Could not load stocks list.');
    }
    return data;
};
