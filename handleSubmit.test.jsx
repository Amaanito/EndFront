/*import { handleSubmit } from './webShop'; 
describe('handleSubmit function', () => {
  test('should submit order successfully', async () => {
    // Simuler en event og nødvendige data
    const e = { preventDefault: jest.fn(), target: { orderComment: { value: 'Test comment' } } };
    const deliveryAddress = {
      name: 'Test Name',
      email: 'test@example.com',
      phone: '12345678',
      addressLine1: 'Test Address 1',
      addressLine2: '',
      zipCode: '12345',
      city: 'Test City',
      country: 'Test Country',
      companyName: 'Test Company',
      vatNumber: 'Test VAT',
    };
    const cart = [{ id: 'test-id', name: 'Test Product', price: 10, currency: 'USD', quantity: 1 }];
    const totalPrice = 10;
    const termsAccepted = true;
    const receiveMarketing = false;
    const getCsrfToken = jest.fn().mockReturnValue('test-csrf-token');

    // Kald funktionen
    await handleSubmit(e, deliveryAddress, cart, totalPrice, termsAccepted, receiveMarketing, getCsrfToken);

    // Forvent at fetch er blevet kaldt med de rigtige parametre
    expect(fetch).toHaveBeenCalledWith("http://127.0.0.1:8000/gem-bruger/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": "test-csrf-token",
      },
      body: JSON.stringify({
        name: 'Test Name',
        email: 'test@example.com',
        phone: '12345678',
        addressLine1: 'Test Address 1',
        addressLine2: '',
        zipCode: '12345',
        city: 'Test City',
        country: 'Test Country',
        companyName: 'Test Company',
        vatNumber: 'Test VAT',
        orderComment: 'Test comment',
        cart: [{ id: 'test-id', name: 'Test Product', price: 10, currency: 'USD', quantity: 1 }],
        totalPrice: 10,
        termsAccepted: true,
        receiveMarketing: false
      })
    });
  });
});*/
