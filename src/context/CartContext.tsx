import React, { createContext, useContext, useReducer } from 'react';

// Initial State
const initialState = {
  cartItems: [],
  totalQuantity: 0,
  totalAmount: 0,
};

// Create Context
const CartContext = createContext(initialState);

// Cart Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const updatedItems = [...state.cartItems, action.payload];
      const updatedQuantity = state.totalQuantity + 1;
      const updatedAmount = state.totalAmount + action.payload.price;
      return {
        ...state,
        cartItems: updatedItems,
        totalQuantity: updatedQuantity,
        totalAmount: updatedAmount,
      };
    case 'REMOVE_ITEM':
      const filteredItems = state.cartItems.filter(item => item.id !== action.payload.id);
      const finalQuantity = state.totalQuantity - 1;
      const finalAmount = state.totalAmount - action.payload.price;
      return {
        ...state,
        cartItems: filteredItems,
        totalQuantity: finalQuantity,
        totalAmount: finalAmount,
      };
    case 'CLEAR_CART':
      return initialState;
    default:
      return state;
  }
};

// Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook to use the Cart Context
export const useCart = () => {
  return useContext(CartContext);
};
