import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false); // New state for marketing acceptance
  const [deliveryAddress, setDeliveryAddress] = useState({
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
  const [postnumre, setPostnumre] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch('https://api.dataforsyningen.dk/postnumre')
      .then(response => response.json())
      .then(data => {
        setPostnumre(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching post codes:', error);
        setError('Kunne ikke hente postnumre');
        setIsLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "zipCode") {
      const postNummerObj = postnumre.find(
        (postnummer) => postnummer.nr === value.split(" ")[0]
      );
      setDeliveryAddress((prevState) => ({
        ...prevState,
        zipCode: value.split(" ")[0],
        city: postNummerObj ? postNummerObj.navn : "",
      }));
    } else {
      setDeliveryAddress((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }



  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validering af indtastede oplysninger
    if (deliveryAddress.name.trim() === '' ||
        deliveryAddress.email.trim() === '' ||
        deliveryAddress.phone.trim() === '' ||
        deliveryAddress.addressLine1.trim() === '' ||
        deliveryAddress.zipCode.trim() === '' ||
        deliveryAddress.city.trim() === '' ||
        !termsAccepted) {
      alert('Accepter vilkår og betingelser for at fortsætte.');
      return;
    }
    // Håndtering af formularsubmit
    setFormSubmitted(true);
  };

  return (
    <div>
      <h1>Leverings- og faktureringsadresse</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="text" name="name" placeholder="Navn" required value={deliveryAddress.name} onChange={handleInputChange} 
          style={{ width: '305px', height: '20px', marginBottom: '10px' }} />
        </div>
        <div>
          <input type="email" name="email" placeholder="Email" required value={deliveryAddress.email} onChange={handleInputChange} 
          style={{ width: '305px', height: '20px', marginBottom: '10px' }} />
        </div>
        <div>
          <input type="text" name="phone" placeholder="Telefon" required value={deliveryAddress.phone} onChange={handleInputChange} 
          style={{ width: '305px', height: '20px', marginBottom: '10px' }} />
        </div>
        <div>
          <input type="text" name="addressLine1" placeholder="Adresse linje 1" required value={deliveryAddress.addressLine1} onChange={handleInputChange} 
          style={{ width: '305px', height: '20px', marginBottom: '10px' }} />
        </div>
        <div>
          <input type="text" name="addressLine2" placeholder="Adresse linje 2" value={deliveryAddress.addressLine2} onChange={handleInputChange} 
          style={{ width: '305px', height: '20px', marginBottom: '10px' }} />
        </div>
        <div>
          <select
            name="zipCode"
            required
            value={deliveryAddress.zipCode}
            onChange={handleInputChange}
            style={{ width: '315px', height: '25px', marginBottom: '10px' }} 
            >
            <option value="">Vælg postnummer</option>
            {postnumre.map(postnummer => (
              <option key={postnummer.nr} value={postnummer.nr}>
                {postnummer.nr} {postnummer.navn}
              </option>
            ))}
          </select>
          {isLoading && <p>Postnumre indlæses...</p>}
          {error && <p>{error}</p>}
        </div>
        
        <div>
          <input type="text" name="city" placeholder="By" required value={deliveryAddress.city} onChange={handleInputChange} 
          style={{ width: '305px', height: '20px', marginBottom: '10px' }} />
        </div>
        <div>
          <input type="text" name="country" placeholder="Land" required value={deliveryAddress.country} onChange={handleInputChange} disabled 
          style={{ width: '305px', height: '20px', marginBottom: '10px' }} />
        </div>
        <div>
          <input type="text" name="companyName" placeholder="Firmanavn" value={deliveryAddress.companyName} onChange={handleInputChange}
          style={{ width: '305px', height: '20px', marginBottom: '10px' }} />
        </div>
        <div>
          <input type="text" name="vatNumber" placeholder="CVR-nummer" value={deliveryAddress.vatNumber} onChange={handleInputChange} 
          style={{ width: '305px', height: '20px', marginBottom: '10px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="orderComment"></label>
          <textarea
            id="orderComment"
            name="orderComment"
            placeholder="Tilføj en kommentar til din ordre her..."
            style={{ width: '100%', height: '150px', padding: '10px', boxSizing: 'border-box' }}
          ></textarea>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
          <div style={{ marginRight: '15px' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
              <button style={{ backgroundColor: 'red', color: 'white', width: '125px' }}>Tilbage</button>
            </Link>
          </div>
          <div style={{ marginLeft: '10px' }}>
            <button type="submit" style={{ backgroundColor: 'green', color: 'white', width: '125px' }}>Bekræft</button>
          </div>
        </div>
        
        <div>
          <input type="checkbox" id="terms" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
          <label htmlFor="terms">Jeg accepterer vilkår og betingelser</label>
        </div>
        
        <div>
          <input type="checkbox" id="marketing" checked={marketingAccepted} onChange={(e) => setMarketingAccepted(e.target.checked)} />
          <label htmlFor="marketing">Jeg accepterer at modtage marketingsmails</label>
        </div>
        
        {formSubmitted && <Link to="/payment">Fortsæt til betaling →</Link>}
      </form>
    </div>
  );
};

export default Checkout;
