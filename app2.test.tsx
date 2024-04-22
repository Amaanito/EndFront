import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {App2} from './src/webShop';
import React from 'react';


describe('App2', () => {
  it('submitting the form triggers handleSubmit', async () => {
    render(<App2/>);
    await userEvent.type(screen.getByLabelText('Navn'), 'John Doe');
    await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
   await userEvent.click(screen.getByText(/Submit Order/));
  
    fireEvent.change(screen.getByLabelText('Telefon'), {
      target: { value: '12345678' },
  });
    fireEvent.change(screen.getByLabelText(/Adresse linje 1/), {
      target: { value: "123 Main St" },
    });
    fireEvent.change(screen.getByLabelText(/Adresse linje 2/), {
      target: { value: "Apt 1" },
    });
    fireEvent.change(screen.getByLabelText(/Postnummer/), {
      target: { value: "12345" },
    });
    fireEvent.change(screen.getByLabelText(/By/), {
      target: { value: "Cityville" },
    });
    fireEvent.change(screen.getByLabelText(/Firmanavn/), {
      target: { value: "ACME Inc." },
    });
    fireEvent.change(screen.getByLabelText(/CVR-nummer/), {
      target: { value: "12345678" },
    });
    fireEvent.change(screen.getByLabelText(/Kommentar til ordre/), {
      target: { value: "Ingen særlige bemærkninger" },
    });

    fireEvent.click(
      screen.getByLabelText(/Jeg accepterer vilkår og betingelser/)
    );
    fireEvent.click(
      screen.getByLabelText(/Jeg ønsker at modtage marketingemails/)
    );

    fireEvent.click(screen.getByText(/Submit Order/));

    await screen.findByText(/Order submitted successfully!/);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "http://localhost:8000/billing",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "John Doe",
          email: "john@example.com",
          termsAccepted: true,
          receiveMarketing: true,
        }),
      }
    );
  }); 
}); 
