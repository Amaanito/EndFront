import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "../App"; 

test('renders home page when "/" is navigated to', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  expect(screen.getByText("Produkter")).toBeInTheDocument(); 
});

test('renders checkout page when "/checkout" is navigated to', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  expect(screen.getByText("Indkøbsvogn")).toBeInTheDocument(); 
});

test('renders confirm page when "/confirm" is navigated to', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const totalPriceElement = screen.queryByText(/Total pris:/i); 
  expect(totalPriceElement).toBeInTheDocument();
});
