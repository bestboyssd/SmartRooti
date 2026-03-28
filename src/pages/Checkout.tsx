import React from 'react';
import { useState } from 'react';

const Checkout = () => {
    const [paymentMethod, setPaymentMethod] = useState('');

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle the COD payment logic here
        alert(`Payment method selected: ${paymentMethod}`);
    };

    return (
        <div>
            <h1>Checkout Page</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        <input
                            type="radio"
                            value="COD"
                            checked={paymentMethod === 'COD'}
                            onChange={handlePaymentMethodChange}
                        />
                        Cash on Delivery (COD)
                    </label>
                </div>
                <button type="submit">Proceed to Payment</button>
            </form>
        </div>
    );
};

export default Checkout;
