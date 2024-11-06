import {authRequest, HttpMethod} from '.';
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
