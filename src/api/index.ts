import {AuthError} from '../errors/AuthError';

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

interface ApiRequestOptions {
    body?: unknown;
    headers?: Record<string, string>;
    method?: HttpMethod;
}

export const request = async (url: string, options: ApiRequestOptions = {}) => {
    const {body, headers, method = HttpMethod.GET} = options;
    const config: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    };
    if (method !== 'GET' && body) {
        config.body = JSON.stringify(body);
    }
    const response = await fetch(url, config);
    let data;
    if (response.status === 204) {
        data = {};
    } else {
        data = await response.json();
    }
    return {response, data};
};

export const authRequest = async (url: string, options: ApiRequestOptions = {}) => {
    const token = localStorage.getItem('token');
    if (token) {
        options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`
        };
    }
    const {response, data} = await request(url, options);
    if (response.status === 401 || response.status === 404) {
        throw new AuthError(data.type);
    }
    return {response, data};
};
