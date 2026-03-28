import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Cart from './pages/Cart';

const App = () => {
  return (
    <CartProvider>
      <Router>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/cart' component={Cart} />
        </Switch>
      </Router>
    </CartProvider>
  );
};

export default App;