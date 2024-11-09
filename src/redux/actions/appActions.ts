export type AppAction = {type: 'SET_IS_LOADING'; payload: boolean};

export const setIsLoading = (payload: boolean): AppAction => ({
    type: 'SET_IS_LOADING',
    payload
});
