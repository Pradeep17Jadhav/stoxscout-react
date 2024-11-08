import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {Portfolio} from './components/Portfolio/Portfolio';
import {AddPurchase} from './components/AddPurchase/AddPurchase';
import {Container, ThemeProvider, createTheme} from '@mui/material';
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
import PortfolioUpdater from './components/PortfolioUpdater/PortfolioUpdater';

import './App.css';

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
                <PortfolioUpdater>
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
                </PortfolioUpdater>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
