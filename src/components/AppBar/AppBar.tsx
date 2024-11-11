import React, {useState, useMemo, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, IconButton, Menu, MenuItem, Tooltip, Box, Avatar, Typography, Container, Toolbar} from '@mui/material';
import AddchartIcon from '@mui/icons-material/Addchart';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListIcon from '@mui/icons-material/List';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TodayIcon from '@mui/icons-material/Today';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {usePortfolio} from '../../hooks/usePortfolio';
import {useUser} from '../../hooks/useUser';
import {useAuth} from '../../hooks/useAuth';
import {useApp} from '../../hooks/useApp';
import {IndexInfo} from './IndexInfo/IndexInfo';
import {useChartsData} from '../../hooks/useCharts';
import './styles.css';

const AppBar = () => {
    const {indices} = usePortfolio();
    const {holdingSummary} = useUser();
    const {isAuthenticated, logoutUser} = useAuth();
    const {name = 'User'} = useUser();
    const {isLoading} = useApp();
    const {advanced, declined} = useChartsData();
    const navigate = useNavigate();

    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = useCallback(
        (event: React.MouseEvent<HTMLElement>) => setAnchorElNav(event.currentTarget),
        []
    );
    const handleOpenUserMenu = useCallback(
        (event: React.MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget),
        []
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

    const handleCloseUserMenu = useCallback(() => setAnchorElUser(null), []);

    const convertToPrice = useCallback((strPrice: string) => parseFloat(strPrice.replace(/,/g, '')), []);

    const pages = useMemo(
        () => [
            {to: '/dashboard', label: 'Dashboard', Icon: DashboardIcon},
            {to: '/', label: 'Holdings', Icon: ListIcon},
            {to: '/portfolioByDate', label: 'Days', Icon: CalendarTodayIcon},
            {to: '/portfolioByMonth', label: 'Months', Icon: TodayIcon},
            {to: '/portfolioByYear', label: 'Years', Icon: CalendarMonthIcon},
            {to: '/heatmapPNL', label: 'Charts', Icon: LeaderboardIcon},
            {to: '/addPurchase', label: 'Add Purchase', Icon: AddShoppingCartIcon},
            {to: '/upload', label: 'Upload', Icon: CloudUploadIcon}
        ],
        []
    );

    const settings = useMemo(
        () => (isAuthenticated ? ['Profile', 'Account', 'Logout'] : ['Login', 'Signup']),
        [isAuthenticated]
    );

    const handleLogout = useCallback(() => {
        handleCloseUserMenu();
        logoutUser();
    }, [handleCloseUserMenu, logoutUser]);

    const userMenuItems = useMemo(() => {
        return (
            <div>
                {isAuthenticated && (
                    <MenuItem key={name}>
                        <Typography>Hello, {name}!</Typography>
                    </MenuItem>
                )}
                {settings.map((setting) => (
                    <MenuItem key={setting} onClick={setting === 'Logout' ? handleLogout : handleCloseUserMenu}>
                        <Typography>{setting}</Typography>
                    </MenuItem>
                ))}
            </div>
        );
    }, [handleCloseUserMenu, handleLogout, isAuthenticated, name, settings]);

    return isLoading ? (
        <></>
    ) : (
        <Container className="appbar-container" maxWidth={false}>
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
                    stoXscout
                </Typography>

                <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
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
                        <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                            <Avatar alt="P" />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{mt: '45px'}}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                        disableScrollLock
                    >
                        {userMenuItems}
                    </Menu>
                </Box>
            </Toolbar>
        </Container>
    );
};

export default AppBar;
