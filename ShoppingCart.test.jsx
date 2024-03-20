import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ShoppingCart from './ShoppingCart';

describe('renders shopping cart and displays cart items', () => {
  it("should work", () => { 
    expect(2+2).toBe(4);
  });

  const removeFromCart = vi.fn();
  const cart = [
    { id: 1, name: 'Product 1', price: 100, quantity: 2 },
    { id: 2, name: 'Product 2', price: 200, quantity: 1 },
  ];

  it("should render cart items correctly", () =>  {
    render(<ShoppingCart cart={cart} removeFromCart={removeFromCart} />);
    expect(screen.getByText('Product 1 - 100 DKK - Quantity: 2')).toBeInTheDocument();
    expect(screen.getByText('Product 2 - 200 DKK - Quantity: 1')).toBeInTheDocument();
  });
});
