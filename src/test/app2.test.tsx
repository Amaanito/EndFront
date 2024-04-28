import { render, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Checkout from '../Checkout'; // Erstat med din faktiske importsti

describe('Checkout', () => {
  it('skal indsende formularen korrekt', async () => {

    const initialState = {
      productsInCart: [
        { id: '1', name: 'Produkt 1', price: 100, quantity: 2, rebateQuantity: 1, rebatePercent: 10 }
      ]
    };

 
    render(
      <MemoryRouter initialEntries={[{ pathname: '/checkout', state: initialState }]}>
        <Checkout />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Navn'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Telefon'), { target: { value: '12345678' } });
    fireEvent.change(screen.getByPlaceholderText('Adresse linje 1'), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByPlaceholderText('By'), { target: { value: 'Anytown' } });
    fireEvent.change(screen.getByPlaceholderText('Firmanavn'), { target: { value: 'Company Inc.' } });
    fireEvent.change(screen.getByPlaceholderText('CVR-nummer'), { target: { value: '123456789' } });
    fireEvent.click(screen.getByLabelText('Jeg accepterer vilkår og betingelser'));

  });
});