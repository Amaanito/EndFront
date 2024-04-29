import { render, fireEvent } from '@testing-library/react';
import CartItem from '../CartItem';
import { test, expect, vi } from 'vitest'

test('renders cart item and handles remove from cart', () => {
  const removeFromCart = vi.fn();
  const item = { id: 1, name: 'Product 1', price: 100, quantity: 2 };

  const { getByText } = render(<CartItem item={item} removeFromCart={removeFromCart} />);

  expect(getByText('Product 1 - 100 DKK - Quantity: 2')).toBeInTheDocument();

  fireEvent.click(getByText('Remove'));

  expect(removeFromCart).toHaveBeenCalledWith(1);
});