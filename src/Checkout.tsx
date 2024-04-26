import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

const Checkout = () => {
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
    setIsLoading(true);
    fetch("https://api.dataforsyningen.dk/postnumre")
      .then(response => response.json())
      .then(data => {
        setPostnumre(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching post codes:", error);
        setError("Kunne ikke hente postnumre");
        setIsLoading(false);
      });
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  
    // Ingen opdatering af phoneError her
    if (name === "phone") {
      e.target.setCustomValidity("");
    
      if (value && (!/^\d*$/.test(value) || value.length > 8)) {
        setPhoneError("Kontaktnummer er ugyldigt. Det skal være et tal og maksimalt 8 cifre langt.");
        e.target.setCustomValidity("Kontaktnummer er ugyldigt. Det skal være et tal og maksimalt 8 cifre langt.");
      } else {
        setPhoneError("");
        e.target.setCustomValidity(""); // Rydder eventuelle valideringsfejl
      
      }
    } else if (name === "zipCode") {
      const postNummerObj = postnumre.find(
        (postnummer) => postnummer.nr === value.split(" ")[0]
      );
      setDeliveryAddress((prevState) => ({
        ...prevState,
        zipCode: value.split(" ")[0],
        city: postNummerObj ? postNummerObj.navn : "",
      }));
    } else {
    
    }
  };

  const handlePhoneInput = (e) => {
    const { value } = e.target;
    if (value && (!/^\d*$/.test(value) || value.length > 8)) {
      // Fjernede setPhoneError opkaldet
      e.target.setCustomValidity("Kontaktnummer er ugyldigt. Det skal være et tal og maksimalt 8 cifre langt.");
      e.target.reportValidity();
    } else {
      e.target.setCustomValidity(""); // Rydder eventuelle valideringsfejl
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phoneError) {
      alert(phoneError);
      return;
    }
    // Validering af indtastede oplysninger
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
    // Håndtering af formularsubmit
    
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
    };
    try {
      const response = await fetch(
        /*"http://127.0.0.1:8000/gem-bruger/"*/ "https://eonz7flpdjy1og5.m.pipedream.net",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        history.push("/confirm");
        //window.alert("Order submitted successfully!");
      } else {
        window.alert("Order submission failed!");
      }
    } catch (error) {
      console.error("There was a problem with sending data:", error);
    }
  };

  return (
    <div>
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
  onChange={handleInputChange} // Håndterer ændring af state
  onInput={handlePhoneInput} // Tjekker for valideringsfejl med det samme
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
            {postnumre.map((postnummer) => (
              <option key={postnummer.nr} value={postnummer.nr}>
                {postnummer.nr} {postnummer.navn}
              </option>
            ))}
          </select>
          {isLoading && <p>Postnumre indlæses...</p>}
          {error && <p>{error}</p>}
        </div>

        <div>
          <input
            type="text"
            name="city"
            placeholder="By"
            required
            value={deliveryAddress.city}
            onChange={handleInputChange}
            style={{ width: "305px", height: "20px", marginBottom: "10px" }}
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

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "10px",
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
            >
              Bekræft
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
    </div>
  );
};

export default Checkout;