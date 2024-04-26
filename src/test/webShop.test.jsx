import { removeFromCart, calculateTotalPrice } from '../../webShop';
import { test, expect} from 'vitest'

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

test('calculateTotalPrice calculates total price correctly', () => {
  const cart = [
    { id: 1, name: 'Product 1', price: 100, quantity: 2, rebateQuantity: 2, rebatePercent: 10 },
    { id: 2, name: 'Product 2', price: 200, quantity: 1, rebateQuantity: 0, rebatePercent: 0 },
  ];

  // Calculate the expected total price manually
  // Product 1: price = 100, quantity = 2, rebateQuantity = 2, rebatePercent = 10%
  // Total price for product 1 = (100 * 2) - (100 * 2 * 0.1) = 200 - 20 = 180
  // Product 2: price = 200, quantity = 1, no rebate
  // Total price for product 2 = 200
  // Total price = 180 + 200 = 380

  const expectedTotalPrice = 380;
  const totalPrice = calculateTotalPrice(cart);

  // Check if the calculated total price matches the expected value
  expect(totalPrice).toBe(expectedTotalPrice);
});