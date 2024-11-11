import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {Portfolio} from './pages/Portfolio/Portfolio';
import {AddPurchase} from './components/AddPurchase/AddPurchase';
import {ThemeProvider, createTheme} from '@mui/material';
import {PortfolioByDate} from './components/PortfolioByDate/PortfolioByDate';
import {PortfolioByYear} from './components/PortFolioByYear/PortfolioByYear';
import {HeatMap} from './components/Heatmap/Heatmap';
import {HeatMapPNL} from './components/HeatmapPNL/HeatmapPNL';
import {PortfolioByMonth} from './components/PortfolioByMonth/PortfolioByMonth';
import AppBar from './components/AppBar/AppBar';
import {Login} from './components/Login/Login';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import {Signup} from './components/Signup/Signup';
import HoldingsUploader from './components/HoldingsUploader/HoldingsUploader';
import AppUpdater from './components/AppUpdater/AppUpdater';
import {Loader} from './components/Loader/Loader';
import {Dashboard} from './pages/Dashboard/Dashboard';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';

import './App.css';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';

const theme = createTheme({
    typography: {
        fontFamily: [
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
        ].join(',')
    }
});

const privateRoutes = [
    {path: '/', Component: Portfolio},
    {path: '/dashboard', Component: Dashboard},
    {path: '/addPurchase', Component: AddPurchase},
    {path: '/portfolioByDate', Component: PortfolioByDate},
    {path: '/portfolioByMonth', Component: PortfolioByMonth},
    {path: '/portfolioByYear', Component: PortfolioByYear},
    {path: '/heatmap', Component: HeatMap},
    {path: '/heatmapPNL', Component: HeatMapPNL},
    {path: '/upload', Component: HoldingsUploader}
];

function App() {
    return (
        <ThemeProvider theme={theme}>
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
    );
}

export default App;
