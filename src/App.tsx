import {useMemo} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {AddPurchase} from './components/AddPurchase/AddPurchase';
import {ThemeProvider} from '@mui/material';
import {
    Experimental_CssVarsProvider as CssVarsProvider,
    experimental_extendTheme as extendTheme,
    createTheme
} from '@mui/material/styles';
import {HeatMap} from './components/Heatmap/Heatmap';
import {HeatMapPNL} from './components/HeatmapPNL/HeatmapPNL';
import AppBar from './components/AppBar/AppBar';
import {Login} from './components/Login/Login';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import {Signup} from './components/Signup/Signup';
import HoldingsUploader from './components/HoldingsUploader/HoldingsUploader';
import AppUpdater from './components/AppUpdater/AppUpdater';
import {Loader} from './components/Loader/Loader';
import {Dashboard} from './pages/Dashboard/Dashboard';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import {Holdings} from './pages/Holdings/Holdings';
import {Landing} from './pages/Landing/Landing';
import {THEME} from './types/userPreferences';
import usePreferences from './hooks/usePreferences';
import {Portfolio} from './pages/PortFolio/Portfolio';
import './App.css';

const fontFamily = [
    'Inter',
    'Roboto',
    'Arial',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"'
].join(',');

const lightTheme = createTheme({
    typography: {
        fontFamily
    },
    palette: {
        mode: 'light'
    }
});

const darkTheme = createTheme({
    typography: {
        fontFamily
    },
    palette: {
        mode: 'dark',
        background: {
            paper: '#101010'
        }
    }
});

function App() {
    const {theme} = usePreferences();
    const activeTheme = theme === THEME.LIGHT ? lightTheme : darkTheme;
    const extendedTheme = useMemo(
        () =>
            extendTheme({
                colorSchemes: {
                    light: {
                        ...lightTheme
                    },
                    dark: {
                        ...darkTheme
                    }
                }
            }),
        []
    );

    const privateRoutes = [
        {path: '/', Component: Landing},
        {path: '/portfolio', Component: Portfolio},
        {path: '/holdings', Component: Holdings},
        {path: '/dashboard', Component: Dashboard},
        {path: '/addPurchase', Component: AddPurchase},
        {path: '/heatmap', Component: HeatMap},
        {path: '/heatmapPNL', Component: HeatMapPNL},
        {path: '/upload', Component: HoldingsUploader}
    ];

    return (
        <CssVarsProvider theme={extendedTheme}>
            <ThemeProvider theme={activeTheme}>
                <BrowserRouter>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <AppUpdater>
                            <Loader />
                            <div className="app-container">
                                <AppBar />
                                <div className="main-content">
                                    <Routes>
                                        {privateRoutes.map(({path, Component}) => (
                                            <Route
                                                key={path}
                                                path={path}
                                                element={
                                                    <PrivateRoute>
                                                        <Component />
                                                    </PrivateRoute>
                                                }
                                            />
                                        ))}
                                        <Route path="/login" element={<Login />}></Route>
                                        <Route path="/signup" element={<Signup />}></Route>
                                    </Routes>
                                </div>
                            </div>
                        </AppUpdater>
                    </LocalizationProvider>
                </BrowserRouter>
            </ThemeProvider>
        </CssVarsProvider>
    );
}

export default App;
