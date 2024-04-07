import React from 'react';

export function ProductList({ products, addToCart, upsellNotification }) {
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name} - {product.price} DKK
          <button onClick={() => addToCart(product.id)}>Add to Cart</button>
          {product.upsellProductId && (
            <button onClick={() => upsellNotification(product.upsellProductId)}>Se dyre alternativ</button> 
          )}
        </li>
      ))}
    </ul>
  );
}

export function CartItem({ item, removeFromCart, updateQuantity }) {
  return (
    <li>
      {item.name} - {item.price} DKK - Quantity: 
      <select value={item.quantity} onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}>
        {[...Array(10).keys()].map(i => 
          <option key={i + 1} value={i + 1}>{i + 1}</option>
        )}
      </select>
      <button onClick={() => removeFromCart(item.id)}>Remove</button>
      <p>Price per item: {item.price} DKK</p>
      <p>Total price: {item.price * item.quantity} DKK</p>
    </li>
  );
}

export function ShoppingCart({ cart, removeFromCart }) {

  const updateQuantity = (itemId, newQuantity) => {
    
    console.log(`Opdaterede mængden for ${itemId} til ${newQuantity}. Denne funktion er ikke implementeret endnu.`);
  };

  if (cart.length === 0){
    return <p> Din Indskøbsvogn er tom</p>;
  }

  return (
    <ul>
      {cart.map(item => (
        <CartItem 
          key={item.id} 
          item={item} 
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity} 
        />
      ))}
    </ul>
  );
}


export function App2() {
  const [products, setProducts] = React.useState([]);
  const [cart, setCart] = React.useState([]);
  const [totalPrice, setTotalPrice] = React.useState(0);
  const [deliveryAddress, setDeliveryAddress] = React.useState({
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    zipCode: '',
    city: '',
    country: 'Denmark',
    companyName: '',
    vatNumber: '',
  });
  const [postnumre, setPostnumre] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  React.useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetch('/items.json').then(res => {
        if (!res.ok) throw new Error('Kunne ikke indlæse produkter');
        return res.json();
      }),
      fetch('https://api.dataforsyningen.dk/postnumre').then(res => {
        if (!res.ok) throw new Error('Kunne ikke indlæse postnumre');
        return res.json();
      })
    ]).then(([productsData, postnumreData]) => {
      setProducts(productsData);
      setPostnumre(postnumreData);
      setIsLoading(false);
    }).catch(err => {
      console.error('Fejl:', err);
      setError('Fejl ved indlæsning af data. ' + err.message);
      setIsLoading(false);
    });
  }, []);

  const addToCart = (productId) => {
    const productToAdd = products.find(product => product.id === productId);
    const existingCartItem = cart.find(item => item.id === productId);
    let newCart;

    if (existingCartItem) {
      newCart = cart.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...cart, { ...productToAdd, quantity: 1 }];
    }

    setCart(newCart);
    setTotalPrice(calculateTotalPrice(newCart));
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.id !== productId);

    setCart(newCart);
    setTotalPrice(calculateTotalPrice(newCart));
  };

  const calculateTotalPrice = (cart) => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress({
      ...deliveryAddress,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted address:', deliveryAddress);
  };

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <h1>Products</h1>
      <ProductList products={products} addToCart={addToCart} upsellNotification={(upsellProductId) => alert(`Overvej også dette produkt for en bedre værdi! Produkt ID: ${upsellProductId}`)} />
      <h2>Shopping Cart</h2>
      <ShoppingCart cart={cart} removeFromCart={removeFromCart} />
      <p>Total Price: {totalPrice.toFixed(2)} DKK</p>
      <h2>Leverings- og faktureringsadresse</h2>
      <form onSubmit={handleSubmit}>
        {/* Delivery address form inputs */}
        <input type="text" name="name" placeholder="Navn" required value={deliveryAddress.name} onChange={handleInputChange} />
        <input type="email" name="email" placeholder="Email" required value={deliveryAddress.email} onChange={handleInputChange} />
        <input type="text" name="phone" placeholder="Telefon" required value={deliveryAddress.phone} onChange={handleInputChange} />
        <input type="text" name="addressLine1" placeholder="Adresse linje 1" required value={deliveryAddress.addressLine1} onChange={handleInputChange} />
        <input type="text" name="addressLine2" placeholder="Adresse linje 2" value={deliveryAddress.addressLine2} onChange={handleInputChange} />
        <select name="zipCode" required value={deliveryAddress.zipCode} onChange={handleInputChange}>
          <option value="">Vælg postnummer</option>
          {postnumre.map(postnummer => (
            <option key={postnummer.nr} value={postnummer.nr}>{`${postnummer.nr} ${postnummer.navn}`}</option>
          ))}
        </select>
        <input type="text" name="city" placeholder="By" required value={deliveryAddress.city} onChange={handleInputChange} />
        <input type="text" name="country" placeholder="Land" required value={deliveryAddress.country} disabled />
        <input type="text" name="companyName" placeholder="Firmanavn" value={deliveryAddress.companyName} onChange={handleInputChange} />
        <input type="text" name="vatNumber" placeholder="CVR-nummer" value={deliveryAddress.vatNumber} onChange={handleInputChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
