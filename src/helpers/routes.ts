import {AddPurchase} from '../components/AddPurchase/AddPurchase';
import {ForgotPassword} from '../components/ForgotPassword/ForgotPassword';
import {HeatMap} from '../components/Heatmap/Heatmap';
import {HeatMapPNL} from '../components/HeatmapPNL/HeatmapPNL';
import HoldingsUploader from '../components/HoldingsUploader/HoldingsUploader';
import {Login} from '../components/Login/Login';
import {Signup} from '../components/Signup/Signup';
import SIPCalculator from '../components/SIPCalculator/SIPCalculator';
import {Dashboard} from '../pages/Dashboard/Dashboard';
import {Holdings} from '../pages/Holdings/Holdings';
import {Landing} from '../pages/Landing/Landing';
import {Portfolio} from '../pages/PortFolio/Portfolio';

export const privateRoutes = [
    {path: '/', Component: Landing},
    {path: '/portfolio', Component: Portfolio},
    {path: '/holdings', Component: Holdings},
    {path: '/dashboard', Component: Dashboard},
    {path: '/addPurchase', Component: AddPurchase},
    {path: '/heatmap', Component: HeatMap},
    {path: '/heatmapPNL', Component: HeatMapPNL},
    {path: '/upload', Component: HoldingsUploader}
];

export const publicRoutes = [
    {path: '/login', Component: Login},
    {path: '/signup', Component: Signup},
    {path: '/forgotPassword', Component: ForgotPassword},
    {path: '/SIPCalculator', Component: SIPCalculator}
];
