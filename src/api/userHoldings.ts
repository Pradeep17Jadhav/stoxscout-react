import {Purchase} from '../types/purchase';
import {HttpMethod, request} from './api';

export const getUserHoldings = () => request('http://localhost:4000/holdings');

export const addPurchase = (purchase: Purchase) =>
    request('http://localhost:4000/addPurchase', {
        method: HttpMethod.POST,
        body: purchase
    });
