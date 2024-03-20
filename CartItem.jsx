import React from 'react';

function CartItem({ item, removeFromCart }) {
  return (
    <li>
      {item.name} - {item.price} DKK - Quantity: {item.quantity}
      <button onClick={() => removeFromCart(item.id)}>Remove</button>
    </li>
  );
}

export default CartItem;