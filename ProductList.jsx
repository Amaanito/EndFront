import React from 'react';

function ProductList({ products, addToCart, upsellNotification }) {
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name} - {product.price} DKK
          <button onClick={() => addToCart(product.id)}id={product.id} aria-label= {`add ${product.name} to cart`}>Add to Cart</button>
          {product.upsellProductId && (
            <button onClick={() => upsellNotification(product.upsellProductId)}>se dyre alternativ</button> 
          )}
        </li>
      ))}
    </ul>
  );
}

export default ProductList;