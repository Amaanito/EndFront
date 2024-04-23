import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [receiveMarketing, setReceiveMarketing] = useState(false);
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
    if (name === 'zipCode') {
      const postnummerObj = postnumre.find(postnummer => postnummer.nr === value);
      setDeliveryAddress(prevState => ({
        ...prevState,
        zipCode: value,
        city: postnummerObj ? postnummerObj.navn : ''
      }));
    } else {
      setDeliveryAddress(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div>
      <div style={{ margin: -50 }}></div>
      <div>
        <h1>Leverings- og faktureringsadresse</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="text" name="name" placeholder="Navn" required value={deliveryAddress.name} onChange={handleInputChange} 
            style={{ width: '300px', height: '20px', marginBottom: '10px' }} />
        </div>
        <div>
          <input type="email" name="email" placeholder="Email" required value={deliveryAddress.email} onChange={handleInputChange}  
            style={{ width: '300px', height: '20px', marginBottom: '10px' }} />
        </div>
        <div>
          <input type="text" name="phone" placeholder="Telefon" required value={deliveryAddress.phone} onChange={handleInputChange} 
            style={{ width: '300px', height: '20px', marginBottom: '10px' }} />
        </div>
        <div>
          <input type="text" name="addressLine1" placeholder="Adresse linje 1" required value={deliveryAddress.addressLine1} onChange={handleInputChange} 
            style={{ width: '300px', height: '20px', marginBottom: '10px' }} />
        </div>
        <div>
          <input type="text" name="addressLine2" placeholder="Adresse linje 2" value={deliveryAddress.addressLine2} onChange={handleInputChange} 
            style={{ width: '300px', height: '20px', marginBottom: '10px' }} />
        </div>
        <div>
          <label htmlFor="zipCode"></label>
          <select
            id="zipCode"
            name="zipCode"
            required
            value={deliveryAddress.zipCode}
            onChange={handleInputChange}
            style={{ width: '300px', height: '20px', marginBottom: '10px' }}
          >
            <option value="">Vælg postnummer</option>

            {postnumre.map(postnummer => (
              <option key={postnummer.nr} value={postnummer.nr}>
                {postnummer.nr} {postnummer.navn}
              </option>
            ))}
          </select>
          {isLoading && <p>Henter postnumre...</p>}
          {error && <p>{error}</p>}
        </div>
        <div>
          <input type="text" name="city" placeholder="By" required value={deliveryAddress.city} onChange={handleInputChange}
            style={{ width: '300px', height: '20px', marginBottom: '10px' }} />
        </div>
        <div>
          <input type="text" name="country" placeholder="Land" required value={deliveryAddress.country} onChange={handleInputChange} disabled
            style={{ width: '300px', height: '20px', marginBottom: '10px' }} />
        </div>
        <div>
          <input type="text" name="companyName" placeholder="Firmanavn" value={deliveryAddress.companyName} onChange={handleInputChange}
            style={{ width: '300px', height: '20px', marginBottom: '10px' }} />
        </div>
        <div>
          <input type="text" name="vatNumber" placeholder="CVR-nummer" value={deliveryAddress.vatNumber} onChange={handleInputChange}
            style={{ width: '300px', height: '20px', marginBottom: '10px' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
          <label htmlFor="orderComment" style={{ alignSelf: 'center', marginBottom: '5px' }}>Kommentar til ordre:</label>
          <textarea
            id="orderComment"
            name="orderComment"
            placeholder="Tilføj en kommentar til din ordre her..."
            style={{ width: '50%', height: '100px' }}
          ></textarea>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Link to="/">
            <button style={{ backgroundColor: 'red', color: 'white', width: '125px', marginTop: '10px' }}>Tilbage</button>
          </Link>
          <Link to="/payment">
            <button type="submit" style={{ backgroundColor: 'green', color: 'white', width: '125px' }}>Fortsæt</button>
          </Link>
        </div>
        <div>
          <input type="checkbox" id="terms" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
          <label htmlFor="terms">Jeg accepterer vilkår og betingelser</label>
        </div>
        <div>
          <input type="checkbox" id="marketing" checked={receiveMarketing} onChange={(e) => setReceiveMarketing(e.target.checked)} />
          <label htmlFor="marketing">Jeg ønsker at modtage marketingemails</label>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
