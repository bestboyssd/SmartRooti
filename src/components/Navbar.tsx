import React from 'react';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="floating-navbar">
            <ul>
                <li>Home</li>
                <li>About</li>
                <li>Services</li>
                <li>Contact</li>
            </ul>
        </nav>
    );
};

export default Navbar;