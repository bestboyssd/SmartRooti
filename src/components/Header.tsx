import React from 'react';
import './Header.css'; // Assuming a CSS file for styling

const Header: React.FC = () => {
    return (
        <header className="sticky-header">
            <div className="brand">Brand Name</div>
            <div className="tagline">Your catchy tagline goes here</div>
        </header>
    );
};

export default Header;