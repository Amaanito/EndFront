import React from 'react';
import { Link } from 'react-router-dom';


export function ProductList({ products, addToCart, upsellNotification }) {
  const numProductsPerRow = 4; // Antal produkter pr. række
  const columnWidth = `calc(100% / ${numProductsPerRow} - 20px)`;
  const marginRight = '20px';
  const productHeight = '475px'; // Specifik højde til produktbjælkerne


  return (
    <div 
      style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between', 
        alignItems: 'stretch' // Udvider bjælkerne til at fylde deres forældres højde
      }}
    >
      {products.map((product, index) => (
        <div 
          key={product.id} 
          style={{ 
            width: columnWidth, 
            marginBottom: '100px', 
            marginRight: index % numProductsPerRow === numProductsPerRow - 1 ? 0 : marginRight 
          }}
        >
          <div style={{ height: productHeight }}>
  <div style={{ border: '3px solid #ccc', padding: '20px', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>{product.name}</div>

      <img src={product.imageUrl} alt={product.name} style={{ marginBottom: '10px', maxWidth: '100%', height:'300px' }} />

      <div 
      style={{ marginBottom: '10px' }}>{product.price} DKK</div>
    </div>


    <div>
      <button 
      style={{ marginTop: '10px', backgroundColor: 'orange' }} onClick={() => addToCart(product.id)}
      >Add to Cart
      </button>

      {product.upsellProductId && (

        <button style={{ marginTop: '10px', backgroundColor: 'black', color: 'white' }} onClick={() => upsellNotification(product.upsellProductId)}>
          Se alternativ 
          </button>
      )}
    </div>
  </div>
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
        <p>Total price of this product: {item.price * item.quantity} DKK</p>
      </li>
    );
  }
  
  
  /**
  @author Haashir Khan
  */
  export function ShoppingCart({ cart, removeFromCart }) {
   if (cart.length=== 0){
    return <h3> Din Indskøbsvogn er tom</h3>
        }
    return (
      <ul>
      {cart.map(item => (
      <CartItem key={item.id} item={item} removeFromCart={removeFromCart} updateQuantity={undefined} />
            ))}
          </ul>
        );
      }

      
      export function App() {
      
    
        const [termsAccepted, setTermsAccepted] = React.useState(false);
        const [receiveMarketing, setReceiveMarketing] = React.useState(false);
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
            newCart = cart.map(item => item.id === productId ? { ...item, quantity: item.quantity + 1 } : item);
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
          setDeliveryAddress({ ...deliveryAddress, [name]: value });
        };
      
        const handleSubmit = async (e) => {
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
            vatNumber: deliveryAddress.vatNumber,
            orderComment: e.target.orderComment.value,
            cart,
            totalPrice,
            termsAccepted,
            receiveMarketing

        

          };
            try {
              const response = await fetch("https://eonz7flpdjy1og5.m.pipedream.net", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
              });
              if (response.ok) {
                window.alert('Order submitted successfully!'); // Ændring: Brug af window.alert for en pop op besked
              } else {
                window.alert('Order submission failed!'); // Ændring: Brug af window.alert for en pop op besked
              }
            } catch (error) {
              console.error('There was a problem with sending data:', error);
            }
        };
      
        const scrollToShoppingCart = () => {
          document.getElementById('shopping-cart').scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
      
        return (
          
      
           <div style={{ margin: -40 }}>
            <h1 style={{ maxWidth: '100%', height: '70px', backgroundColor: 'White', margin: 0 }}>
           
              <img src="kurv.png"
               style={{ width: '50px', height: 'auto', marginLeft: '1150px', marginTop: '15px', background: 'none', cursor: 'pointer' }} 
                onClick={scrollToShoppingCart} />
            </h1>

            
            
            <h1>Products</h1>
            <ProductList products={products} addToCart={addToCart} upsellNotification={upsellNotification} />
      
            <img src="kurv.png"
               style={{ width: '75px', height: 'auto',  marginTop: '30px', background: 'none' }}  />

            <h1 id="shopping-cart">Shopping Cart</h1>
        
            <ShoppingCart cart={cart} removeFromCart={removeFromCart} />
            <h3>Total Price: <span>{totalPrice.toFixed(2)} DKK</span></h3>
         
            
           
            <Link to="/checkout">
            <button type="submit" style={{ backgroundColor: 'green', color: 'white', width: '125px' }}>Submit Order</button>
          </Link>
          
            </div>

   

    
  );
}

export default App;