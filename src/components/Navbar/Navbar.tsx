import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { IndexInfo } from "./IndexInfo/IndexInfo";
import useIndicesData from '../../hooks/useIndicesData';
import './styles.css';
import { PortfolioContext } from '../../context/PortfolioContext';

const Navbar = () => {
    const { indicesData } = useIndicesData();
    const context = useContext(PortfolioContext);

    if (!context) {
        throw new Error('PortfolioProvider is not initialized');
    }
    const { holdingSummary } = context;
    const convertToPrice = (strPrice: string) => parseFloat(strPrice.replace(/,/g, ''));

    return (
        <nav className="navbar">
            <div className="indices">
                {indicesData.map(index => (<IndexInfo key={index.indexSymbol} index={index} />))}
                <IndexInfo key='userPortfolio' index={{
                    indexSymbol: 'Portfolio',
                    current: convertToPrice(holdingSummary.totalDayChange),
                    percentChange: convertToPrice(holdingSummary.totalDayChangePercentage)
                }} />
            </div>
            <div className="links">
                <Link className="nav-link" to="/">Portfolio</Link>
                <Link className="nav-link" to="/addPurchase">Add Purchase</Link>
                <Link className="nav-link" to="/portfolioByDate">Portfolio by Date</Link>
                <Link className="nav-link" to="/portfolioByMonth">Portfolio by Month</Link>
                <Link className="nav-link" to="/portfolioByYear">Portfolio by Year</Link>
                <Link className="nav-link" to="/heatmap">Heatmap</Link>
                <Link className="nav-link" to="/heatmapPNL">Heatmap PNL</Link>
            </div>
        </nav>
    );
};

export default Navbar;