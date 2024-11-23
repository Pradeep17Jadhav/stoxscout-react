import {useEffect} from 'react';
import {useColorScheme} from '@mui/material';
import usePreferences from './usePreferences';
import {THEME} from '../types/userPreferences';

export const useSystemTheme = () => {
    const {setMode} = useColorScheme();
    const {theme} = usePreferences();

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const setInitialTheme = () => {
            if (!theme || theme === THEME.SYSTEM_DEFAULT) {
                setMode(mediaQuery.matches ? 'dark' : 'light');
            }
        };
        mediaQuery.addEventListener('change', setInitialTheme);
        setInitialTheme();
        return () => {
            mediaQuery.removeEventListener('change', setInitialTheme);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (theme === THEME.DARK) {
            setMode('dark');
        } else if (theme === THEME.LIGHT) {
            setMode('light');
        }
    }, [setMode, theme]);

    return theme;
};

export default useSystemTheme;
