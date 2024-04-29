import { removeFromCart, calculateTotalPrice } from '../../webShop';
import { test, expect } from 'vitest'

test('removeFromCart reduces quantity or removes item', () => {
  const cart = [
    { id: 1, name: 'Product 1', price: 100, quantity: 2 },
    { id: 2, name: 'Product 2', price: 200, quantity: 1 },
  ];

  const newCart = removeFromCart(cart, 1);

  expect(newCart[0].quantity).toBe(1);

  expect(newCart).toContainEqual(cart[1]);
});

test('calculateTotalPrice calculates total price correctly with 10% discount for orders over 300 DKK', () => {
  const cart = [
    { id: 1, name: 'Product 1', price: 100, quantity: 2, rebateQuantity: 2, rebatePercent: 10 },
    { id: 2, name: 'Product 2', price: 200, quantity: 1, rebateQuantity: 0, rebatePercent: 0 },
  ];

  const totalPrice = calculateTotalPrice(cart);
  const expectedTotalPrice = ((100 - 10) * 2 + 200) * 0.9;

  expect(totalPrice).toBe(expectedTotalPrice);
});
