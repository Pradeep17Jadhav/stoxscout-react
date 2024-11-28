import React, {useState, useMemo, useCallback, useEffect, useRef} from 'react';
import {useDispatch} from 'react-redux';
import {isMobile} from 'react-device-detect';
import classnames from 'classnames';
import {useNavigate, useLocation} from 'react-router-dom';
import {IconButton, Menu, MenuItem, Tooltip, Box, Avatar, Typography, Container, Toolbar, Popover} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import {grey} from '@mui/material/colors';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {usePortfolio} from '../../hooks/usePortfolio';
import {useUser} from '../../hooks/useUser';
import {useAuth} from '../../hooks/useAuth';
import {IndexInfo} from './IndexInfo/IndexInfo';
import {useChartsData} from '../../hooks/useCharts';
import {getUpdatedAgo} from '../../helpers/dateUtils';
import {ThemeSwitcher} from '../Switcher/ThemeSwitcher/ThemeSwitcher';
import {THEME} from '../../types/userPreferences';
import usePreferences from '../../hooks/usePreferences';
import {AppDispatch} from '../../redux/store/store';
import './styles.css';

const AppBar = () => {
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();
    const {indices, marketLastUpdated} = usePortfolio();
    const {holdingSummary, name} = useUser();
    const {isAuthenticated, logoutUser} = useAuth();
    const {advanced, declined} = useChartsData();
    const navigate = useNavigate();
    const {updateThemePreferences, theme} = usePreferences();
    const showDark = location.pathname === '/holdings' ? true : false;

    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [popoverAnchor, setPopoverAnchor] = useState<null | HTMLElement>(null);
    const [updatedAgo, setUpdatedAgo] = useState('');
    const marketLastUpdatedRef = useRef(marketLastUpdated);

    const handleOpenNavMenu = useCallback(
        (event: React.MouseEvent<HTMLElement>) => setAnchorElNav(event.currentTarget),
        []
    );

    const handlePopoverOpen = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setPopoverAnchor(event.currentTarget);
    }, []);

    const handlePopoverClose = useCallback(() => {
        setPopoverAnchor(null);
    }, []);

    const onThemeChange = useCallback(
        (theme: THEME) => {
            dispatch(updateThemePreferences(theme));
        },
        [dispatch, updateThemePreferences]
    );

    const handleCloseNavMenu = useCallback(
        (to: string) => () => {
            setAnchorElNav(null);
            if (to) {
                navigate(to);
            }
        },
        [navigate]
    );

    const convertToPrice = useCallback((strPrice: string) => parseFloat(strPrice.replace(/,/g, '')), []);

    const pages = useMemo(
        () => [
            {to: '/dashboard', label: 'Dashboard', Icon: DashboardIcon},
            ...(isMobile ? [{to: '/holdings', label: 'Holdings', Icon: ListAltOutlinedIcon}] : []),
            {to: '/portfolio', label: 'Portfolio', Icon: ListAltOutlinedIcon},
            {to: '/heatmapPNL', label: 'Charts', Icon: LeaderboardIcon},
            {to: '/addPurchase', label: 'Add Purchase', Icon: AddShoppingCartIcon},
            {to: '/upload', label: 'Upload', Icon: CloudUploadIcon}
        ],
        []
    );

    const settings = useMemo(() => (isAuthenticated ? ['Profile', 'Logout'] : ['Login', 'Signup']), [isAuthenticated]);

    const handleMenuItemClick = useCallback(
        (setting: string) => () => {
            handlePopoverClose();
            switch (setting) {
                case 'Logout': {
                    logoutUser();
                    break;
                }
                case 'Signup': {
                    navigate('/signup');
                    break;
                }
                case 'Login': {
                    navigate('/login');
                    break;
                }
                case 'Profile': {
                    break;
                }
            }
        },
        [handlePopoverClose, logoutUser, navigate]
    );

    useEffect(() => {
        marketLastUpdatedRef.current = marketLastUpdated;
    }, [marketLastUpdated]);

    useEffect(() => {
        const intervalId = setInterval(() => setUpdatedAgo(getUpdatedAgo(marketLastUpdatedRef.current)), 1000);
        return () => clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const lastUpdatedTimestamp = useMemo(
        () =>
            isAuthenticated &&
            updatedAgo && (
                <span className="updatedTime">
                    <AccessTimeIcon />
                    {updatedAgo}
                </span>
            ),
        [isAuthenticated, updatedAgo]
    );

    const userMenuItems = useMemo(() => {
        return (
            <div>
                {isAuthenticated && (
                    <MenuItem key={name} disabled>
                        <Typography>Hello, {name}!</Typography>
                    </MenuItem>
                )}
                <ThemeSwitcher onThemeChange={onThemeChange} currentTheme={theme} />
                {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleMenuItemClick(setting)}>
                        <Typography>{setting}</Typography>
                    </MenuItem>
                ))}
            </div>
        );
    }, [handleMenuItemClick, isAuthenticated, name, onThemeChange, settings, theme]);

    return (
        <Container className={classnames('appbar-container', showDark && 'dark')} maxWidth={false}>
            <Toolbar disableGutters>
                <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    sx={{
                        mr: 2,
                        display: {xs: 'none', md: 'flex'},
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.2rem',
                        color: 'inherit',
                        textDecoration: 'none'
                    }}
                >
                    <span className="profit">Magny</span>
                    <span className="loss">Fire</span>
                </Typography>

                <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                    <IconButton
                        size="large"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                        disabled={!isAuthenticated}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left'
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left'
                        }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu('')}
                        sx={{display: {xs: 'block', md: 'none'}}}
                    >
                        {pages.map((page) => (
                            <MenuItem key={page.label} onClick={handleCloseNavMenu(page.to)}>
                                <Typography sx={{textAlign: 'center'}}>{page.label}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>

                <Box sx={{flexGrow: 1, display: {xs: 'none', sm: 'flex'}}}>
                    {isAuthenticated &&
                        pages.map(({label, to, Icon}) => (
                            <Tooltip key={label} title={label}>
                                <IconButton size="large" onClick={handleCloseNavMenu(to)} color="default">
                                    <Icon />
                                </IconButton>
                            </Tooltip>
                        ))}
                </Box>

                {lastUpdatedTimestamp}
                {isAuthenticated && (
                    <Tooltip title="Advance Decline Ratio">
                        <Box sx={{display: {xs: 'none', md: 'flex'}}}>
                            <div className="advanced-declined">
                                <div className="profit advanced-declined-divider">{advanced}</div>
                                <div className="loss">{declined}</div>
                            </div>
                        </Box>
                    </Tooltip>
                )}

                {isAuthenticated && (
                    <Box className="indices" sx={{display: {xs: 'none', md: 'flex'}}}>
                        {indices.map((index) => (
                            <IndexInfo key={index.indexSymbol} index={index} />
                        ))}
                        <IndexInfo
                            index={{
                                indexSymbol: 'Total P&L',
                                current: convertToPrice(holdingSummary.totalPnl),
                                percentChange: convertToPrice(holdingSummary.totalPnlPercentage)
                            }}
                        />
                        <IndexInfo
                            index={{
                                indexSymbol: 'Day P&L',
                                current: convertToPrice(holdingSummary.totalDayChange),
                                percentChange: convertToPrice(holdingSummary.totalDayChangePercentage)
                            }}
                        />
                    </Box>
                )}

                <Box sx={{flexGrow: 0}}>
                    <Tooltip title="Open settings">
                        <IconButton onClick={handlePopoverOpen} sx={{p: 0}}>
                            <Avatar alt={name} sx={{bgcolor: grey[600]}}>
                                {name === 'User' ? undefined : name.slice(0, 1)}
                            </Avatar>
                        </IconButton>
                    </Tooltip>
                    <Popover
                        open={Boolean(popoverAnchor)}
                        anchorEl={popoverAnchor}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                        onClose={handlePopoverClose}
                        sx={{
                            width: 300,
                            height: 500
                        }}
                        disableScrollLock
                    >
                        {userMenuItems}
                    </Popover>
                </Box>
            </Toolbar>
        </Container>
    );
};

export default AppBar;
