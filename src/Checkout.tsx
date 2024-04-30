import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
const Checkout = () => {
  const location = useLocation();
  const { productsInCart } = location.state || {};
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    zipCode: "",
    city: "",
    country: "Denmark",
    companyName: "",
    vatNumber: "",
  });
  const [phoneError, setPhoneError] = useState("");
  const [postnumre, setPostnumre] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const history = useHistory();
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://api.dataforsyningen.dk/postnumre"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        const data = await response.json();
        setPostnumre(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching post codes:", error);
        setError("Kunne ikke hente postnumre");
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const metaViewport = document.createElement("meta");
    metaViewport.setAttribute("name", "viewport");
    metaViewport.setAttribute("content", "width=device-width, initial-scale=1");
    document.head.appendChild(metaViewport);
    return () => {
      document.head.removeChild(metaViewport);
    };
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "name") {
      const isValidName = /^[A-Za-z\s'-]+$/.test(value);
      e.target.setCustomValidity(
        isValidName ? "" : "Navnet må kun indeholde bogstaver."
      );
      if (!isValidName) {
        e.target.reportValidity();
      }
    } else if (name === "phone") {
      e.target.setCustomValidity("");
    }
    if (name === "phone") {
      e.target.setCustomValidity("");
      if (value && (!/^\d*$/.test(value) || value.length > 8)) {
        setPhoneError(
          "Kontaktnummer er ugyldigt. Det skal være et tal og maksimalt 8 cifre langt."
        );
        e.target.setCustomValidity(
          "Kontaktnummer er ugyldigt. Det skal være et tal og maksimalt 8 cifre langt."
        );
      } else {
        setPhoneError("");
        e.target.setCustomValidity("");
      }
    } else if (name === "zipCode") {
      const postNummerObj = postnumre.find(
        (postnummer) => postnummer.nr === value
      );
      if (postNummerObj) {
        setDeliveryAddress((prevState) => ({
          ...prevState,
          city: postNummerObj.navn,
        }));
        document.getElementById("city").setAttribute("readonly", "readonly");
      } else {
        document.getElementById("city").removeAttribute("readonly");
      }
    }
  };
  const handlePhoneInput = (e) => {
    const { value } = e.target;
    if (value && (!/^\d*$/.test(value) || value.length > 8)) {
      e.target.setCustomValidity(
        "Kontaktnummer er ugyldigt. Det skal være et tal og maksimalt 8 cifre langt."
      );
      e.target.reportValidity();
    } else {
      e.target.setCustomValidity("");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phoneError) {
      alert(phoneError);
      return;
    }
    if (
      deliveryAddress.name.trim() === "" ||
      deliveryAddress.email.trim() === "" ||
      deliveryAddress.phone.trim() === "" ||
      deliveryAddress.addressLine1.trim() === "" ||
      deliveryAddress.zipCode.trim() === "" ||
      deliveryAddress.city.trim() === "" ||
      !termsAccepted
    ) {
      alert("Accepter vilkår og betingelser for at fortsætte.");
      return;
    }
    setIsLoading(true);
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
      termsAccepted,
      marketingAccepted,
      productsInCart,
      totalPriceInfo,
    };
    try {
      const response = await fetch(
        "http://localhost:3000/billing" /*"https://eonz7flpdjy1og5.m.pipedream.net"*/,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        setIsLoading(false);
        history.push("/confirm");
      } else {
        setIsLoading(false);
        window.alert("Order submission failed!");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("There was a problem with sending data:", error);
    }
  };
  const calculateTotalPrice = (cart) => {
    if (!cart || cart.length === 0) {
      return {
        subtotal: 0,
        discountOver300: 0,
        orderDiscount: 0,
        totalPrice: 0,
      };
    }
    let subtotal = 0;
    let discountOver300 = 0;
    let orderDiscount = 0;
    cart.forEach((item) => {
      subtotal += item.price * item.quantity;
      if (item.quantity >= item.rebateQuantity && item.rebateQuantity > 0) {
        discountOver300 +=
          item.quantity * (item.price * (item.rebatePercent / 100));
      }
    });
    if (subtotal > 300) {
      orderDiscount = (subtotal - discountOver300) * 0.1;
    }
    const totalPrice = subtotal - discountOver300 - orderDiscount;
    return { subtotal, discountOver300, orderDiscount, totalPrice };
  };
  const totalPriceInfo = calculateTotalPrice(productsInCart);
  return (
    <div style={{ width: "100%" }}>
      <h1>Leverings- og faktureringsadresse</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="name"
            placeholder="Navn"
            required
            value={deliveryAddress.name}
            onChange={handleInputChange}
            style={{ width: "305px", height: "20px", marginBottom: "10px" }}
            pattern="^[A-Za-z\s'-]+$"
            title="Navnet må kun indeholde bogstaver."
          />
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={deliveryAddress.email}
            onChange={handleInputChange}
            style={{ width: "305px", height: "20px", marginBottom: "10px" }}
          />
        </div>
        <div>
          <input
            type="text"
            name="phone"
            placeholder="Telefon"
            required
            value={deliveryAddress.phone}
            onChange={handleInputChange}
            onInput={handlePhoneInput}
            style={{ width: "305px", height: "20px", marginBottom: "10px" }}
            pattern="^\d{1,8}$"
            title="Kontaktnummer er ugyldigt. Det skal være et tal og maksimalt 8 cifre langt."
          />
        </div>
        <div>
          <input
            type="text"
            name="addressLine1"
            placeholder="Adresse linje 1"
            required
            value={deliveryAddress.addressLine1}
            onChange={handleInputChange}
            style={{ width: "305px", height: "20px", marginBottom: "10px" }}
            title="Du skal udfylde adressefeltet."
          />
        </div>
        <div>
          <input
            type="text"
            name="addressLine2"
            placeholder="Adresse linje 2"
            value={deliveryAddress.addressLine2}
            onChange={handleInputChange}
            style={{ width: "305px", height: "20px", marginBottom: "10px" }}
          />
        </div>
        <div>
          <select
            name="zipCode"
            required
            value={deliveryAddress.zipCode}
            onChange={handleInputChange}
            style={{ width: "315px", height: "25px", marginBottom: "10px" }}
          >
            <option value="">Vælg postnummer</option>
            {postnumre &&
              Array.isArray(postnumre) &&
              postnumre.map((postnummer) => (
                <option key={postnummer.nr} value={postnummer.nr}>
                  {postnummer.nr} {postnummer.navn}
                </option>
              ))}
          </select>
          {error && <p>{error}</p>}
        </div>
        <div>
          <input
            type="text"
            name="city"
            id="city"
            placeholder="By"
            required
            value={deliveryAddress.city}
            onChange={handleInputChange}
            style={{ width: "305px", height: "20px", marginBottom: "10px" }}
            readOnly={deliveryAddress.city !== ""}
          />
        </div>
        <div>
          <input
            type="text"
            name="country"
            placeholder="Land"
            required
            value={deliveryAddress.country}
            onChange={handleInputChange}
            disabled
            style={{ width: "305px", height: "20px", marginBottom: "10px" }}
          />
        </div>
        <div>
          <input
            type="text"
            name="companyName"
            placeholder="Firmanavn"
            value={deliveryAddress.companyName}
            onChange={handleInputChange}
            style={{ width: "305px", height: "20px", marginBottom: "10px" }}
          />
        </div>
        <div>
          <input
            type="text"
            name="vatNumber"
            placeholder="CVR-nummer"
            value={deliveryAddress.vatNumber}
            onChange={handleInputChange}
            pattern="^\d{8}$|^$"
            title="CVR-nummer skal være præcis 8 cifre langt, hvis det angives."
            style={{ width: "305px", height: "20px", marginBottom: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="orderComment"></label>
          <textarea
            id="orderComment"
            name="orderComment"
            placeholder="Tilføj en kommentar til din ordre her..."
            style={{
              width: "350px",
              height: "100px",
              padding: "10px",
              boxSizing: "border-box",
            }}
          ></textarea>
        </div>

        <div>
          <h1>Kurv</h1>

          <ul style={{ listStyleType: "none", marginLeft: "210px" }}>

            {productsInCart && productsInCart.length > 0 ? (
              productsInCart.map((product) => (
                <li
                  key={product.id}
                  style={{
                    display: "flex",
                    maxWidth: "320px",
                    marginBottom: "20px",
                    outline: "1px solid #ccc",
                    padding: "10px",
                  }}
                >
                  <div style={{ marginRight: "20px" }}>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      style={{ maxWidth: "100px", height: "auto" }}
                    />
                  </div>
                  <div>
                    <p
                      style={{
                        margin: 0,
                        marginBottom: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      {product.name}
                    </p>
                    <p style={{ margin: 0, marginBottom: "5px" }}>
                      Pris: {product.price.toFixed(2)} DKK
                    </p>
                    <p style={{ margin: 0 }}>Antal: {product.quantity}</p>
                    {product.quantity >= product.rebateQuantity &&
                      product.rebateQuantity > 0 && (
                        <p className="cart-item-discount">
                          Rabat: -
                          {(
                            product.quantity *
                            (product.price * (product.rebatePercent / 100))
                          ).toFixed(2)}{" "}
                          kr.
                        </p>
                      )}
                  </div>
                </li>
              ))
            ) : (
              <ul style={{ listStyleType: "none", marginRight: "285px", textAlign: "center" }}>

                <li>Ingen produkter i kurven</li>
              </ul>
            )}
          </ul>
          <h3>Subtotal: {totalPriceInfo.subtotal.toFixed(2)} DKK</h3>
          {totalPriceInfo.discountOver300 > 0 && (
            <p className="total-discount" style={{ color: "orange" }}>
              Total varebaseret rabat: -
              {totalPriceInfo.discountOver300.toFixed(2)} DKK
            </p>
          )}
          {totalPriceInfo.orderDiscount > 0 && (
            <p className="order-discount" style={{ color: "orange" }}>
              Ordrebaseret rabat (over 300 DKK): -
              {totalPriceInfo.orderDiscount.toFixed(2)} DKK
            </p>
          )}
          <h3>Total: {totalPriceInfo.totalPrice.toFixed(2)} DKK</h3>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "10px",
            marginTop: "50px",
          }}
        >
          <div style={{ marginRight: "15px" }}>
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>
              <button
                style={{
                  backgroundColor: "red",
                  color: "white",
                  width: "125px",
                }}
              >
                Tilbage
              </button>
            </Link>
          </div>
          <div style={{ marginLeft: "10px" }}>
            <button
              type="submit"
              style={{
                backgroundColor: "green",
                color: "white",
                width: "125px",
              }}
              disabled={isLoading}
            >
              {isLoading ? "Indlæser..." : "Bekræft"}
            </button>
          </div>
        </div>
        <div>
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
          <label htmlFor="terms">Jeg accepterer vilkår og betingelser</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="marketing"
            checked={marketingAccepted}
            onChange={(e) => setMarketingAccepted(e.target.checked)}
          />
          <label htmlFor="marketing">
            Jeg accepterer at modtage marketingsmails
          </label>
        </div>
      </form>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
    </div>
  );
};
export default Checkout;