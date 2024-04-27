import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function ProductList({ products, addToCart, upsellNotification }) {
  const numProductsPerRow = 4;
  const columnWidth = `calc(100% / ${numProductsPerRow} - 20px)`;
  const marginRight = "20px";
  const productHeight = "475px";

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "stretch",
      }}
    >
      {products.map((product, index) => (
        <div
          key={product.id}
          style={{
            width: columnWidth,
            marginBottom: "100px",
            marginRight:
              index % numProductsPerRow === numProductsPerRow - 1
                ? 0
                : marginRight,
          }}
        >
          <div style={{ height: productHeight }}>
            <div
              style={{
                border: "3px solid #ccc",
                padding: "20px",
                textAlign: "center",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
                  {product.name}
                </div>

                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{
                    marginBottom: "10px",
                    maxWidth: "100%",
                    height: "300px",
                  }}
                />

                <div style={{ marginBottom: "10px" }}>{product.price} DKK</div>
              </div>

              <div>
                <button
                  style={{ marginTop: "10px", backgroundColor: "orange" }}
                  onClick={() => addToCart(product.id)}
                >
                  Tilføj til kurv
                </button>

                {product.upsellProductId && (
                  <button
                    style={{
                      marginTop: "10px",
                      backgroundColor: "black",
                      color: "white",
                    }}
                    onClick={() => upsellNotification(product.upsellProductId)}
                  >
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

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    updateQuantity(item.id, newQuantity);
  };

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
            onChange={handleQuantityChange}
          >
            {[...Array(10).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
        {itemDiscount > 0 && (
          <p className="cart-item-discount">
            Rabat: -{itemDiscount.toFixed(2)} kr.
          </p>
        )}
        <p className="cart-item-total-price">
          Total: {itemFinalTotal.toFixed(2)} kr.
        </p>
        <button
          className="remove-button"
          onClick={() => removeFromCart(item.id)}
        >
          Fjern
        </button>
      </div>
    </div>
  );
}


export function ShoppingCart({ cart, removeFromCart }) {
  if (cart.length === 0) {
    return <h3> Din Indkøbsvogn er tom</h3>;
  }
  return (
    <ul>
      {cart.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          removeFromCart={removeFromCart}
          updateQuantity={undefined}
        />
      ))}
    </ul>
  );
}



export function App2() {
  const [products, setProducts] = React.useState([]);
  const [cart, setCart] = React.useState([]);
  const [totalPrice, setTotalPrice] = React.useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCartEmpty, setIsCartEmpty] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("/items.json")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    setIsCartEmpty(cart.length === 0);
  }, [cart]);

  const addToCart = (productId) => {
    const productToAdd = products.find((product) => product.id === productId);
    const existingCartItem = cart.find((item) => item.id === productId);
    let newCart;

    if (existingCartItem) {
      newCart = cart.map((item) =>
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
    cart.forEach((item) => {
      let itemTotal = item.price * item.quantity;
      if (item.quantity >= item.rebateQuantity && item.rebateQuantity > 0) {
        itemTotal *= 1 - item.rebatePercent / 100;
      }
      totalPrice += itemTotal;
    });

    if (totalPrice > 300) {
      totalPrice *= 0.9;
    }

    return totalPrice;
  };

  const upsellNotification = (upsellProductId) => {
    const upsellProduct = products.find(
      (product) => product.id === upsellProductId
    );
    alert(
      `Overvej også ${upsellProduct.name} til ${upsellProduct.price} DKK for en bedre værdi!`
    );
  };

  const scrollToShoppingCart = () => {
    document
      .getElementById("shopping-cart")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ margin: -40 }}>
      <h1
        style={{
          maxWidth: "100%",
          height: "70px",
          backgroundColor: "White",
          margin: 0,
        }}
      >
        <img
          src="kurv.png"
          style={{
            width: "50px",
            height: "auto",
            marginLeft: "1150px",
            marginTop: "15px",
            background: "none",
            cursor: "pointer",
          }}
          onClick={scrollToShoppingCart}
        />
      </h1>

      <h1>Produkter</h1>
      <ProductList
        products={products}
        addToCart={addToCart}
        upsellNotification={upsellNotification}
      />

      <img
        src="kurv.png"
        style={{
          width: "75px",
          height: "auto",
          marginTop: "30px",
          background: "none",
        }}
      />

      <h1 id="shopping-cart">Indkøbsvogn</h1>

      <ShoppingCart cart={cart} removeFromCart={removeFromCart} />
      <h3>
        Total Pris: <span>{totalPrice.toFixed(2)} DKK</span>
      </h3>

      <div
        style={{
          textAlign: "right",
          marginRight: "150px",
          marginTop: "80px",
          marginBottom: "80px",
        }}
      >
       <Link
  to={{
    pathname: "/checkout",
    state: { productsInCart: cart }, // Overfør kurvens indhold som en del af state-objektet
  }}
>
          <button
            style={{
              backgroundColor: isCartEmpty ? "#ccc" : "green",
              color: "white",
              width: "125px",
            }}
            onClick={() => {
              if (isCartEmpty) {
                alert("Du skal vælge mindst én vare, før du kan gå til kassen.");
              }
            }}
            
          >
            Gå til kassen
          </button>
        </Link>
      </div>
    </div>
  );
}
export default App2;
