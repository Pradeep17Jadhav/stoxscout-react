import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <Link className="nav-link" to="/">Portfolio</Link>
            <Link className="nav-link" to="/addPurchase">Add Purchase</Link>
            <Link className="nav-link" to="/portfolioByDate">Portfolio by Date</Link>
            <Link className="nav-link" to="/portfolioByMonth">Portfolio by Month</Link>
            <Link className="nav-link" to="/portfolioByYear">Portfolio by Year</Link>
            <Link className="nav-link" to="/heatmap">Heatmap</Link>
            <Link className="nav-link" to="/heatmapPNL">Heatmap PNL</Link>
        </nav>
    );
};

export default Navbar;