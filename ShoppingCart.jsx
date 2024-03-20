import React from 'react';
 import CartItem from './CartItem';

function ShoppingCart({ cart, removeFromCart }) {
  return (
    <ul>
      {cart.map(item => (
        <CartItem key={item.id} item={item} removeFromCart={removeFromCart} />
      ))}
    </ul>
  );
  
 
}

export default ShoppingCart;