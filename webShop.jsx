export const removeFromCart = (cart, productId) => {
  const newCart = cart.reduce((acc, item) => {
    if (item.id === productId) {
      if (item.quantity > 1) {
        acc.push({ ...item, quantity: item.quantity - 1 });
      }
    } else {
      acc.push(item);
    }
    return acc;
  }, []);

  return newCart;
};

  
export const calculateTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.forEach(item => {
    let itemTotal = item.price * item.quantity;
    // Anvender individuelle rabatter
    if (item.quantity >= item.rebateQuantity && item.rebateQuantity > 0) {
      itemTotal -= itemTotal * (item.rebatePercent / 100);
    }
    totalPrice += itemTotal;
  });


  if (totalPrice > 300) {
    totalPrice -= totalPrice * 0.1;
  }
  return parseFloat(totalPrice.toFixed(2));
};

