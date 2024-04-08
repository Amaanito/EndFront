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


  if (cart.length === 0){
    return <p> Din Indskøbsvogn er tom</p>;
  }

  return (
    <ul>
      {cart.map(item => (
      <CartItem key={item.id} item={item} removeFromCart={removeFromCart} updateQuantity={undefined} />
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
  
        React.useEffect(() => {
          
          fetch('items.json')
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Error fetching data:', error));
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
  
          setCart(newCart);
          setTotalPrice(calculateTotalPrice(newCart));
        };
  
        const calculateTotalPrice = (cart) => {
          let totalPrice = 0;
          cart.forEach(item => {
            let itemTotal = item.price * item.quantity;
            if (item.quantity >= item.rebateQuantity && item.rebateQuantity > 0) {
              itemTotal *= (1 - item.rebatePercent / 100);
            }
            totalPrice += itemTotal;
          });
  
          if (totalPrice > 300) {
            totalPrice *= 0.9; // Apply 10% discount for orders over 300 DKK
          }
  
          return totalPrice;
        };
  
        const upsellNotification = (upsellProductId) => {
          const upsellProduct = products.find(product => product.id === upsellProductId);
          alert(`Overvej også ${upsellProduct.name} til ${upsellProduct.price} DKK for en bedre værdi!`);
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
          const formData = {
            name: deliveryAddress.name,
            email: deliveryAddress.email,
            phone: deliveryAddress.phone,
            addressLine1: deliveryAddress.addressLine1,
            addressLine2: deliveryAddress.addressLine2,
            zipCode: deliveryAddress.zipCode,
            city: deliveryAddress.city,
            country: deliveryAddress.country,
            companyName: deliveryAddress.companyName,
            vatNumber: deliveryAddress.vatNumber
          };
        
          const headers = new Headers();
          headers.append("Content-Type", "application/json");
        
          const options = {
            method: "POST",
            headers,
            body: JSON.stringify(formData),
          };
          
        
          fetch("https://eonz7flpdjy1og5.m.pipedream.net", options)
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              console.log('Data sent successfully');
            })
            .catch(error => {
              console.error('There was a problem with sending data:', error);
            });
        };
        
        
  
        return (
          <div>
            <h1>Products</h1>
            <ProductList products={products} addToCart={addToCart} upsellNotification={upsellNotification} />
            <h2>Shopping Cart</h2>
            <ShoppingCart cart={cart} removeFromCart={removeFromCart} />
            <p>Total Price: <span>{totalPrice.toFixed(2)} DKK</span></p>
            
            <h2>Leverings- og faktureringsadresse</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder="Navn" required value = {deliveryAddress.name} onChange={handleInputChange} />
              <input type="email" name="email" placeholder="Email" required value={deliveryAddress.email} onChange={handleInputChange} />
              <input type="text" name="phone" placeholder="Telefon" required value={deliveryAddress.phone} onChange={handleInputChange} />
              <input type="text" name="addressLine1" placeholder="Adresse linje 1" required value={deliveryAddress.addressLine1} onChange={handleInputChange} />
              <input type="text" name="addressLine2" placeholder="Adresse linje 2" value={deliveryAddress.addressLine2} onChange={handleInputChange} />
              <input type="text" name="zipCode" placeholder="Postnummer" required value={deliveryAddress.zipCode} onChange={handleInputChange} />
              <input type="text" name="city" placeholder="By" required value={deliveryAddress.city} onChange={handleInputChange} />
              <input type="text" name="country" placeholder="Land" required value={deliveryAddress.country} onChange={handleInputChange} disabled />
              <input type="text" name="companyName" placeholder="Firmanavn" value={deliveryAddress.companyName} onChange={handleInputChange} />
              <input type="text" name="vatNumber" placeholder="CVR-nummer" value={deliveryAddress.vatNumber} onChange={handleInputChange} />
              <button type="submit">Send</button>
            </form>
          </div>
        );
      }
    