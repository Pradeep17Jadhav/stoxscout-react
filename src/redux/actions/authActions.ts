export type AuthAction = {type: 'SET_IS_AUTHENTICATED'; payload: boolean};

export const setIsAuthenticated = (payload: boolean): AuthAction => ({
    type: 'SET_IS_AUTHENTICATED',
    payload
});
