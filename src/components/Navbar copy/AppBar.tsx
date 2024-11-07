import React, {useState, useMemo, useCallback} from 'react';
import {Link} from 'react-router-dom';
import {Button, IconButton, Menu, MenuItem, Tooltip, Box, Avatar, Typography, Container, Toolbar} from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';
import {usePortfolio} from '../../hooks/usePortfolio';
import {useUser} from '../../hooks/useUser';
import {useAuth} from '../../hooks/useAuth';
import {IndexInfo} from './IndexInfo/IndexInfo';
import './styles.css';
import {isMobile} from 'react-device-detect';

const AppBar = () => {
    const {indicesData} = usePortfolio();
    const {holdingSummary} = useUser();
    const {isAuthenticated, logoutUser} = useAuth();

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
    const handleCloseNavMenu = useCallback(() => setAnchorElNav(null), []);
    const handleCloseUserMenu = useCallback(() => setAnchorElUser(null), []);

    const convertToPrice = useCallback((strPrice: string) => parseFloat(strPrice.replace(/,/g, '')), []);

    // Memoizing routes and settings
    const routes = useMemo(
        () => [
            {to: '/', label: 'Portfolio'},
            {to: '/portfolioByDate', label: 'Portfolio by Date'},
            {to: '/portfolioByMonth', label: 'Portfolio by Month'},
            {to: '/portfolioByYear', label: 'Portfolio by Year'},
            {to: '/heatmap', label: 'Heatmap'},
            {to: '/heatmapPNL', label: 'Heatmap PNL'},
            {to: '/addPurchase', label: 'Add Purchase'},
            {to: '/upload', label: 'Upload'}
        ],
        []
    );

    const settings = useMemo(
        () => (isAuthenticated ? ['Profile', 'Account', 'Logout'] : ['Login', 'Signup']),
        [isAuthenticated]
    );

    // Memoizing the rendering functions
    const renderNavLinks = useCallback(
        (links: typeof routes) => {
            return links.map((page) => (
                <MenuItem key={page.label} onClick={handleCloseNavMenu}>
                    <Link to={page.to} className="nav-link">
                        <Typography>{page.label}</Typography>
                    </Link>
                </MenuItem>
            ));
        },
        [handleCloseNavMenu]
    );

    const renderDesktopNavLinks = useCallback(
        (links: typeof routes) => {
            return links.map((page) => (
                <Button key={page.label} onClick={handleCloseNavMenu} className="nav-button">
                    <Link to={page.to} className="nav-link">
                        {page.label}
                    </Link>
                </Button>
            ));
        },
        [handleCloseNavMenu]
    );

    const renderUserMenuItems = useCallback(
        (settings: string[]) => {
            return settings.map((setting) => (
                <MenuItem key={setting} onClick={setting === 'Logout' ? logoutUser : handleCloseUserMenu}>
                    <Typography>{setting}</Typography>
                </MenuItem>
            ));
        },
        [handleCloseUserMenu, logoutUser]
    );

    return (
        <Container maxWidth="xl">
            <Toolbar className="toolbar" disableGutters>
                {/* Desktop Logo */}
                {!isMobile && (
                    <>
                        <AdbIcon className="logo" />
                        <Typography
                            variant="h6"
                            component="a"
                            href="#app-bar-with-responsive-menu"
                            className="logo-text"
                        >
                            StoxScout
                        </Typography>
                    </>
                )}

                {/* Mobile Menu: Appears only if isMobile is true */}
                {isMobile && (
                    <Box className="mobile-menu">
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
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
                            onClose={handleCloseNavMenu}
                            className="mobile-menu-list"
                        >
                            {renderNavLinks(routes)}
                        </Menu>
                    </Box>
                )}

                {/* Indices Data (only for authenticated users) */}
                {isAuthenticated && (
                    <div className="indices">
                        {indicesData.map((index) => (
                            <IndexInfo key={index.indexSymbol} index={index} />
                        ))}
                        <IndexInfo
                            key="userPortfolio"
                            index={{
                                indexSymbol: 'Portfolio',
                                current: convertToPrice(holdingSummary.totalDayChange),
                                percentChange: convertToPrice(holdingSummary.totalDayChangePercentage)
                            }}
                        />
                    </div>
                )}

                {/* Desktop Menu: Should only be visible when not on mobile */}
                {!isMobile && <Box className="desktop-menu">{renderDesktopNavLinks(routes)}</Box>}

                {/* User Menu */}
                <Box className="user-menu">
                    <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu}>
                            <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        className="user-menu-list"
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
                    >
                        {renderUserMenuItems(settings)}
                    </Menu>
                </Box>
            </Toolbar>
        </Container>
    );
};

export default AppBar;
