import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {ThemeProvider} from '@mui/material';
import {Experimental_CssVarsProvider as CssVarsProvider} from '@mui/material/styles';
import AppBar from './components/AppBar/AppBar';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import AppUpdater from './components/AppUpdater/AppUpdater';
import {Loader} from './components/Loader/Loader';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import {THEME} from './types/userPreferences';
import usePreferences from './hooks/usePreferences';
import {SnackBar} from './components/SnackBar/SnackBar';
import {darkTheme, extendedTheme, lightTheme} from './helpers/theme';
import './App.css';
import {privateRoutes, publicRoutes} from './helpers/routes';

function App() {
    const {theme} = usePreferences();
    const activeTheme = theme === THEME.LIGHT ? lightTheme : darkTheme;

    return (
        <CssVarsProvider theme={extendedTheme}>
            <ThemeProvider theme={activeTheme}>
                <BrowserRouter>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <AppUpdater>
                            <Loader />
                            <div className="app-container">
                                <AppBar />
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
                                    {publicRoutes.map(({path, Component}) => (
                                        <Route key={path} path={path} element={<Component />}></Route>
                                    ))}
                                </Routes>
                            </div>
                            <SnackBar />
                        </AppUpdater>
                    </LocalizationProvider>
                </BrowserRouter>
            </ThemeProvider>
        </CssVarsProvider>
    );
}

export default App;
