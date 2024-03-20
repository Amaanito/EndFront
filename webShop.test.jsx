import { removeFromCart, calculateTotalPrice } from './webShop';
import { test, expect} from 'vitest'
import { vitest } from 'vitest';

test('removeFromCart reduces quantity or removes item', () => {
  const cart = [
    { id: 1, name: 'Product 1', price: 100, quantity: 2 },
    { id: 2, name: 'Product 2', price: 200, quantity: 1 },
  ];

  const newCart = removeFromCart(cart, 1);

  // Check that quantity of first item was reduced
  expect(newCart[0].quantity).toBe(1);

  // Check that second item was not removed
  expect(newCart).toContainEqual(cart[1]);
});

test('calculateTotalPrice calculates total price with rebate', () => {
  const cart = [
    { id: 1, name: 'Product 1', price: 100, quantity: 2, rebateQuantity: 2, rebatePercent: 10 },
    { id: 2, name: 'Product 2', price: 200, quantity: 1, rebateQuantity: 0, rebatePercent: 0 },
  ];

  const totalPrice = calculateTotalPrice(cart);

});