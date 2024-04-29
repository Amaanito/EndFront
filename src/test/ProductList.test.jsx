import { render, fireEvent, screen } from '@testing-library/react';
import ProductList from '../ProductList';
import { test, expect, vi } from 'vitest'

test('renders product list and handles add to cart', () => {
  const addToCart = vi.fn();
  const upsellNotification = vi.fn();
  const products = [
    { id: 1, name: 'Product 1', price: 100, upsellProductId: null },
    { id: 2, name: 'Product 2', price: 200, upsellProductId: 3 },
  ];

  render(<ProductList products={products} addToCart={addToCart} upsellNotification={upsellNotification} />);

  expect(screen.getByText('Product 1 - 100 DKK')).toBeInTheDocument();
  expect(screen.getByText('Product 2 - 200 DKK')).toBeInTheDocument();


  fireEvent.click(screen.getByLabelText('add Product 1 to cart'));


  expect(addToCart).toHaveBeenCalledWith(1);
});
