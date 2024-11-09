import {authRequest, HttpMethod} from '.';
import {Preferences} from '../types/userPreferences';
import {endpoints} from './apiConfig';

export const getPreference = async (): Promise<Preferences | null> => {
    const {response, data} = await authRequest(endpoints.preference, {
        method: HttpMethod.GET
    });
    if (!response.ok) {
        switch (data.type) {
            case 'preferences_not_found':
                return null;
            case 'invalid_user_id':
                throw new Error('The provided user ID is invalid. Please contact support.');
            case 'server_error':
                throw new Error('There was an issue with the server. Please try again later.');
            default:
                throw new Error('An unexpected error occurred.');
        }
    }
    return data;
};

export const updatePreference = async (preference: Preferences) => {
    const {response, data} = await authRequest(endpoints.preference, {
        method: HttpMethod.PUT,
        body: {preference}
    });
    if (!response.ok) {
        switch (data.type) {
            case 'invalid_data':
                throw new Error('Invalid data provided. Please check your input.');
            case 'invalid_user_id':
                throw new Error('The provided user ID is invalid. Please contact support.');
            case 'duplicate_preferences':
                throw new Error('Your preferences are already set. Duplicate preferences detected.');
            case 'server_error':
                throw new Error('There was an issue with the server. Please try again later.');
            default:
                throw new Error('An unexpected error occurred.');
        }
    }
    return data;
};
