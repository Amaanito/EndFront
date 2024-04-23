import React from 'react';
import { Link } from 'react-router-dom';

export function ProductList({ products, addToCart, upsellNotification }) {
  const numProductsPerRow = 4; 
  const columnWidth = `calc(100% / ${numProductsPerRow} - 20px)`;
  const marginRight = '20px';
  const productHeight = '475px'; 


  return (
    <div 
      style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between', 
        alignItems: 'stretch' 
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
  const itemTotal = item.price * item.quantity;
  let itemDiscount = 0;

  if (item.quantity >= item.rebateQuantity && item.rebateQuantity > 0) {
    itemDiscount = itemTotal * (item.rebatePercent / 100);
  }

  const itemFinalTotal = itemTotal - itemDiscount;

  return (
    <div className="cart-item">
      <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
      <div className="cart-item-info">
        <h3 className="cart-item-title">{item.name}</h3>
        <p className="cart-item-price">Pris: {item.price.toFixed(2)} kr.</p>
        <div className="cart-item-quantity">
          Antal:
          <select 
            className="quantity-select" 
            value={item.quantity} 
            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
          >
            {[...Array(10).keys()].map(i => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>
        {itemDiscount > 0 && (
          <p className="cart-item-discount">Rabat: -{itemDiscount.toFixed(2)} kr.</p>
        )}
        <p className="cart-item-total-price">Total: {itemFinalTotal.toFixed(2)} kr.</p>
        <button className="remove-button" onClick={() => removeFromCart(item.id)}>
          Fjern
        </button>
      </div>
    </div>
  );
}



  
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
      function getCsrfToken() {
        const cookies = document.cookie.split('; ');
        const csrfCookie = cookies.find(row => row.startsWith('csrftoken='));
        return csrfCookie ? csrfCookie.split('=')[1] : null;
      }
      
      export function App2() {
      
        const [termsAccepted, setTermsAccepted] = React.useState(false);
        const [receiveMarketing, setReceiveMarketing] = React.useState(false);
        const [products, setProducts] = React.useState([]);
        const [cart, setCart] = React.useState([]);
        const [totalPrice, setTotalPrice] = React.useState(0);
        const [postnumre, setPostnumre] = React.useState([]);
        const [isLoading, setIsLoading] = React.useState(false);
        const [error, setError] = React.useState(null);
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

        React.useEffect(() => {
          fetch('https://api.dataforsyningen.dk/postnumre')
            .then(response => response.json())
            .then(data => {
              setPostnumre(data);
              setIsLoading(false);
            })
            .catch(error => {
              console.error('Error fetching post codes:', error);
              setError('Kunne ikke hente postnumre.');
              setIsLoading(false);
            });
        }, []);
          
        
        React.useEffect(() => {
          setIsLoading(true); // Starter indlæsningen
          fetch('https://api.dataforsyningen.dk/postnumre')
            .then(response => response.json())
            .then(data => {
              setPostnumre(data);
              setIsLoading(false); // Stopper indlæsningen
            })
            .catch(error => {
              console.error('Error fetching post codes:', error);
              setIsLoading(false); // Stopper indlæsningen ved fejl
            });
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
          
          if (name === 'zipCode') {
            const postNummerObj = postnumre.find(postnummer => postnummer.nr === value.split(" ")[0]);
            setDeliveryAddress(prevState => ({
              ...prevState,
              zipCode: value.split(" ")[0],
              city: postNummerObj ? postNummerObj.navn : '',
            }));
          } else {
            setDeliveryAddress(prevState => ({
              ...prevState,
              [name]: value,
            }));
          }
        };
        const handleSubmit = async (e) => {
          e.preventDefault();
  if (!termsAccepted) {
    alert("Du skal acceptere vilkår og betingelser for at fortsætte.");
    return;
  }
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
  }; try {
    const response = await fetch("http://127.0.0.1:8000/gem-bruger/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken, // Inkluder CSRF-token her
      },
      body: JSON.stringify(formData)
    });
    if (response.ok) {
      window.alert('Order submitted successfully!');
    } else {
      window.alert('Order submission failed!');
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
         
         

          
            <div style={{ textAlign: 'right', marginRight: '150px', marginTop: '80px',  marginBottom: '80px'}}>
            <Link to="/checkout">
              <button type="submit" style={{ backgroundColor: 'green', color: 'white', width: '125px' }}
              >Submit Order </button>
              </Link>
        </div>
      
      
    </div>
    

   

    
  );
}
      
export default App2;