import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export function ProductList({ products, addToCart, upsellNotification }) {
  const numProductsPerRow = 4;
  const columnWidth = `calc(100% / ${numProductsPerRow} - 15px)`; // Reducerer marginen
  const marginRight = "8px"; // Ændret margin
  const productHeight = "475px";

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center", // Ændret justifyContent til "center"
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
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
    </div>
  );
}

export function CartItem({ item, removeFromCart, updateQuantity }) {
  // Beregner totalen for hver vare baseret på pris og antal
  // Beregner varebaseret rabat hvis betingelserne er opfyldt
  let itemDiscount = 0;
  if (item.quantity >= item.rebateQuantity && item.rebateQuantity > 0) {
    itemDiscount = item.price * item.quantity * (item.rebatePercent / 100);
  }

  // Beregner den endelige total for varen efter rabat

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
            onChange={(e) =>
              updateQuantity(item.id, parseInt(e.target.value, 10))
            }
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

export function ShoppingCart({ cart, removeFromCart, updateQuantity }) {
  // Beregner subtotalen for indkøbskurven uden ordrebaseret rabat
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Beregner den samlede rabat for varerne
  const totalItemDiscounts = cart.reduce((acc, item) => {
    const itemTotal = item.price * item.quantity;
    const itemDiscount =
      item.quantity >= item.rebateQuantity && item.rebateQuantity > 0
        ? itemTotal * (item.rebatePercent / 100)
        : 0;
    return acc + itemDiscount;
  }, 0);

  // Tjekker om subtotalen kvalificerer til en ordrebaseret rabat
  const orderDiscount =
    subtotal > 300 ? (subtotal - totalItemDiscounts) * 0.1 : 0;

  // Beregner den totale pris med alle rabatter

  return (
    <div>
      {cart.length === 0 ? (
        <h3>Din Indskøbsvogn er tom</h3>
      ) : (
        <ul>
          {cart.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity} // Sørg for at give en reel funktion her
            />
          ))}
          <li className="cart-summary">
            {totalItemDiscounts > 0 && (
              <p>
                Total varebaseret rabat: -{totalItemDiscounts.toFixed(2)} DKK
              </p>
            )}
            {orderDiscount > 0 && (
              <p>Ordrebaseret rabat: -{orderDiscount.toFixed(2)} DKK</p>
            )}
            <p>Subtotal: {subtotal.toFixed(2)} DKK</p>
          </li>
        </ul>
      )}
    </div>
  );
}

export function App2() {
  const [products, setProducts] = React.useState([]);
  const [cart, setCart] = React.useState([]);
  const [totalPrice, setTotalPrice] = React.useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCartEmpty, setIsCartEmpty] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/items.json");
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        const data = await response.json();
        setProducts(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setIsCartEmpty(cart.length === 0);
  }, [cart]);

  useEffect(() => {
    const metaViewport = document.createElement("meta");
    metaViewport.setAttribute("name", "viewport");
    metaViewport.setAttribute("content", "width=device-width, initial-scale=1");
    document.head.appendChild(metaViewport);
  
    return () => {
      document.head.removeChild(metaViewport);
    };
  }, []);

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

  const updateQuantity = (productId, quantity) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      const totalPrice = calculateTotalPrice(updatedCart);
      setTotalPrice(totalPrice);
      return updatedCart;
    });
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
      {isLoading && <div data-testid="loading-indicator">Indlæser...</div>}
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

      <ShoppingCart
        cart={cart}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
      />
      <h3>Total pris: {totalPrice.toFixed(2)} DKK</h3>

      <div
        style={{
          textAlign: "right",
          marginRight: "150px",
          marginTop: "80px",
          marginBottom: "80px",
        }}
      >
        <Link
          to={
            !isCartEmpty
              ? {
                  pathname: "/checkout",
                  state: { productsInCart: cart },
                }
              : ""
          }
        >
          <button
            style={{
              backgroundColor: isCartEmpty ? "#ccc" : "green",
              color: "white",
              width: "125px",
            }}
            onClick={() => {
              if (isCartEmpty) {
                alert(
                  "Du skal vælge mindst én vare, før du kan gå til kassen."
                );
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
