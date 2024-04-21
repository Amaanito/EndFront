import { render, screen, fireEvent } from "@testing-library/react";
import App2 from "./webShop";
import { describe, test, expect } from 'vitest'



describe('App2', () => {
  test('submitting the form triggers handleSubmit', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Order submitted successfully!' }),
      })
    );

    render(<App2 />);

  
  });
});
fireEvent.change(screen.getByLabelText('Navn'), {
  target: { value: 'John Doe' },
});
    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Telefon/), {
      target: { value: "12345678" },
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

