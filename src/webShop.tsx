import React from 'react';

export function ProductList({ products, addToCart, upsellNotification }) {
  const columnWidth = 'calc(100% / 7 - 20px)'; // Beregn bredden af hver kolonne
  const marginRight = '20px'; // Margen til højre for hver kolonne

  return (
    <div 
    style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
      {products.map((product, index) => (
        <div key={product.id} 
        style={{ width: columnWidth, marginBottom: '30px', marginRight: index % 7 === 6 ? 0 : marginRight }}>
          <div style={{ border: '3px solid #ccc', padding: '10px' }}>

            <div>{product.name} - {product.price} DKK</div>
            <button style={{ marginTop: '10px' }} onClick={() => addToCart(product.id)}>Add to Cart</button>
            {product.upsellProductId && (
              <button style={{ marginTop: '10px' }} onClick={() => upsellNotification(product.upsellProductId)}>Se dyre alternativ</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}


  
  export function CartItem({ item, removeFromCart, updateQuantity }) {
    return (
      <li>
        {item.name} - {item.price} DKK - Quantity: 
        <select value={item.quantity} onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}>
          {/* Dropdown med antal tilføjelser */}
          {[...Array(10).keys()].map(i => 
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          )}
        </select>
        <button onClick={() => removeFromCart(item.id)}>Remove</button>
        {/* Tilføjelse af prisoplysning pr. enhed */}
        <p>Price per item: {item.price} DKK</p>
        {/* Viser totalprisen for alle enheder af denne vare */}
        <p>Total price: {item.price * item.quantity} DKK</p>
      </li>
    );
  }
  
  
  /**
  @author Haashir Khan
  */
  export function ShoppingCart({ cart, removeFromCart }) {
   if (cart.length=== 0){
    return <p> Din Indskøbsvogn er tom</p>
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
          fetch('/items.json')
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
          console.log('Submitted address:', deliveryAddress);
        };
      
        return (
          <div>
            <h1>Products</h1>
            <ProductList products={products} addToCart={addToCart} upsellNotification={upsellNotification} />

            <h2>
            <img src="AA/kurv.jpg"  style={{ marginRight: '10px' }} />
              Shopping Cart
              </h2>
            
            <ShoppingCart cart={cart} removeFromCart={removeFromCart} />
            <p>Total Price: <span>{totalPrice.toFixed(2)} DKK</span></p>

            <div>

              <h2 
              >Leverings- og faktureringsadresse
              </h2>

             </div>
            
        

            
            <form onSubmit={handleSubmit}>
              <div>
                <input type="text" name="name" placeholder="Navn" required value={deliveryAddress.name} onChange={handleInputChange} />
              </div>

              <div>
                <input type="email" name="email" placeholder="Email" required value={deliveryAddress.email} onChange={handleInputChange} />
              </div>

              <div>
                <input type="text" name="phone" placeholder="Telefon" required value={deliveryAddress.phone} onChange={handleInputChange} />
              </div>

              <div>
                <input type="text" name="addressLine1" placeholder="Adresse linje 1" required value={deliveryAddress.addressLine1} onChange={handleInputChange} />
              </div>

              <div>
                <input type="text" name="addressLine2" placeholder="Adresse linje 2" value={deliveryAddress.addressLine2} onChange={handleInputChange} />
              </div>

              <div>
                <input type="text" name="zipCode" placeholder="Postnummer" required value={deliveryAddress.zipCode} onChange={handleInputChange} />
              </div>

              <div>
                <input type="text" name="city" placeholder="By" required value={deliveryAddress.city} onChange={handleInputChange} />
              </div>

              <div>
                <input type="text" name="country" placeholder="Land" required value={deliveryAddress.country} onChange={handleInputChange} disabled />
              </div>

              <div>
                <input type="text" name="companyName" placeholder="Firmanavn" value={deliveryAddress.companyName} onChange={handleInputChange} />
              </div>

              <div>
                <input type="text" name="vatNumber" placeholder="CVR-nummer" value={deliveryAddress.vatNumber} onChange={handleInputChange} />
                </div>
      <div 
      style={{textAlign: 'right', marginRight: '250px', marginTop: '25px'}}> {/* Justér til højre */}
        <button type="submit">Send</button>
      </div>

    </form>
  </div>
);
      }
      