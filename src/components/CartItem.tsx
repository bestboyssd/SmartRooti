import React from 'react';

interface CartItemProps {
    item: {
        id: number;
        name: string;
        price: number;
        quantity: number;
    };
    onIncrease: (id: number) => void;
    onDecrease: (id: number) => void;
    onRemove: (id: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onIncrease, onDecrease, onRemove }) => {
    return (
        <div className="cart-item">
            <h3>{item.name}</h3>
            <div>
                <span>Price: ${item.price.toFixed(2)}</span>
                <span>Quantity: {item.quantity}</span>
            </div>
            <button onClick={() => onIncrease(item.id)}>Increase</button>
            <button onClick={() => onDecrease(item.id)}>Decrease</button>
            <button onClick={() => onRemove(item.id)}>Remove</button>
        </div>
    );
};

export default CartItem;