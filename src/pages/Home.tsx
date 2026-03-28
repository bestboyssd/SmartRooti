import React from 'react';
import { Product } from '../components/Product';
import { Category } from '../components/Category';

const products = [
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 150 },
    { id: 3, name: 'Product 3', price: 200 },
];

const categories = [
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' },
];

const Home = () => {
    return (
        <div>
            <h1>Home Page</h1>
            <h2>Categories</h2>
            <ul>
                {categories.map(category => (
                    <li key={category.id}><Category name={category.name} /></li>
                ))}
            </ul>

            <h2>Products</h2>
            <ul>
                {products.map(product => (
                    <li key={product.id}><Product name={product.name} price={product.price} /></li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
