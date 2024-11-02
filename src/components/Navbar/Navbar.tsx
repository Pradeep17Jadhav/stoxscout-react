import LogoutIcon from '@mui/icons-material/Logout';
import {Link} from 'react-router-dom';
import {IndexInfo} from './IndexInfo/IndexInfo';
import {usePortfolio} from '../../hooks/usePortfolio';
import './styles.css';
import {useAuth} from '../../hooks/useAuth';

const Navbar = () => {
    const {holdingSummary, indicesData} = usePortfolio();
    const {isAuthenticated, logoutUser} = useAuth();

    const convertToPrice = (strPrice: string) => parseFloat(strPrice.replace(/,/g, ''));

    return (
        <nav className="navbar">
            {isAuthenticated && (
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
                        <Link className="nav-link" to="/addPurchase">
                            Add Purchase
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
                        <LogoutIcon onClick={logoutUser} />
                    </div>
                </>
            )}
            {!isAuthenticated && (
                <Link className="nav-link" to="/signup">
                    Signup
                </Link>
            )}
        </nav>
    );
};

export default Navbar;
