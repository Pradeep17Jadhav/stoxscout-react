import {useCallback} from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import Tooltip from '@mui/material/Tooltip/Tooltip';
import {Link} from 'react-router-dom';
import {IndexInfo} from './IndexInfo/IndexInfo';
import {usePortfolio} from '../../hooks/usePortfolio';
import {useUser} from '../../hooks/useUser';
import {useAuth} from '../../hooks/useAuth';

import './styles.css';

const Navbar = () => {
    const {indicesData} = usePortfolio();
    const {holdingSummary} = useUser();
    const {isAuthenticated, logoutUser} = useAuth();

    const convertToPrice = useCallback((strPrice: string) => parseFloat(strPrice.replace(/,/g, '')), []);

    return (
        <nav className="navbar">
            {isAuthenticated ? (
                <>
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
                    <div className="links">
                        <Link className="nav-link" to="/">
                            Portfolio
                        </Link>
                        <Link className="nav-link" to="/portfolioByDate">
                            Portfolio by Date
                        </Link>
                        <Link className="nav-link" to="/portfolioByMonth">
                            Portfolio by Month
                        </Link>
                        <Link className="nav-link" to="/portfolioByYear">
                            Portfolio by Year
                        </Link>
                        <Link className="nav-link" to="/heatmap">
                            Heatmap
                        </Link>
                        <Link className="nav-link" to="/heatmapPNL">
                            Heatmap PNL
                        </Link>
                        <Link className="nav-link" to="/addPurchase">
                            Add Purchase
                        </Link>
                        <Link className="nav-link" to="/upload">
                            Upload
                        </Link>
                        <Tooltip title="Logout" arrow>
                            <LogoutIcon className="logout-btn" onClick={logoutUser} />
                        </Tooltip>
                    </div>
                </>
            ) : (
                <div className="auth-links">
                    <Link className="nav-link" to="/login">
                        Login
                    </Link>

                    <Link className="nav-link" to="/signup">
                        Signup
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
