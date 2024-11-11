import React, {useState, useMemo, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, IconButton, Menu, MenuItem, Tooltip, Box, Avatar, Typography, Container, Toolbar} from '@mui/material';
import AddchartIcon from '@mui/icons-material/Addchart';
import MenuIcon from '@mui/icons-material/Menu';
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
            {to: '/dashboard', label: 'Dashboard'},
            {to: '/', label: 'Holdings'},
            {to: '/portfolioByDate', label: 'Days'},
            {to: '/portfolioByMonth', label: 'Months'},
            {to: '/portfolioByYear', label: 'Years'},
            {to: '/heatmapPNL', label: 'Charts'},
            {to: '/addPurchase', label: 'Add Purchase'},
            {to: '/upload', label: 'Upload'}
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
                <MenuItem key={name}>
                    <Typography>Hello, {name}!</Typography>
                </MenuItem>
                {settings.map((setting) => (
                    <MenuItem key={setting} onClick={setting === 'Logout' ? handleLogout : handleCloseUserMenu}>
                        <Typography>{setting}</Typography>
                    </MenuItem>
                ))}
            </div>
        );
    }, [handleCloseUserMenu, handleLogout, name, settings]);

    return isLoading ? (
        <></>
    ) : (
        <Container className="appbar-container" maxWidth={false}>
            <Toolbar disableGutters>
                <AddchartIcon sx={{display: {xs: 'none', md: 'flex'}, mr: 1}} />
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

                <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                    {isAuthenticated &&
                        pages.map((page) => (
                            <Button
                                key={page.label}
                                onClick={handleCloseNavMenu(page.to)}
                                sx={{my: 2, color: 'black', display: 'block'}}
                            >
                                {page.label}
                            </Button>
                        ))}
                </Box>
                <div className="advanced-declined">
                    <span className="profit">{advanced}</span>/<span className="loss">{declined}</span>
                </div>

                {isAuthenticated && (
                    <div className="indices">
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
                    </div>
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
