import React from 'react';
import { Link } from 'react-router-dom';

const Payment = () => {
return(
  <div>
    <h1>Bank oplysninger!</h1>
    <p> Indtast dine kortoplysninger.</p>


    <Link to= "/Checkout" >
     <button style={{ backgroundColor: 'red', color: 'white', width: '125px', marginTop: '10px' }}>Tilbage</button>
      </Link>

    <Link to="/confirm">
        <button style={{ backgroundColor: 'green', color: 'white', width: '125px' }}>Betal</button>
      </Link>

  </div>
)

}


export default Payment