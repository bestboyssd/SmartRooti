import React from 'react';
import './CategoryScroll.css';

const categories = [
    'Category 1',
    'Category 2',
    'Category 3',
    'Category 4',
    'Category 5',
];

const CategoryScroll = () => {
    return (
        <div className="category-scroll-container">
            <div className="category-scroll">
                {categories.map((category, index) => (
                    <div className="category-item" key={index}>{category}</div>
                ))}
            </div>
        </div>
    );
};

export default CategoryScroll;