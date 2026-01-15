import 'server-only';

const CULQI_API_URL = 'https://api.culqi.com/v2';
const PRIVATE_KEY = process.env.CULQI_PRIVATE_KEY;

export interface CulqiOrder {
  id: string;
  amount: number;
  currency_code: string;
  description: string;
  order_number: string;
  state: string;
  expiration_date: number;
  // ... other fields
}

export async function createOrder(amount: number, currency: string, description: string, email: string, clientDetails: any): Promise<CulqiOrder> {
  if (!PRIVATE_KEY || PRIVATE_KEY === "testing-culqi-key") {
    // For development without keys, return a mock?
    // if (process.env.NODE_ENV === 'development') {
      return {
        id: `ord_mock_${Date.now()}`,
        amount,
        currency_code: currency,
        description,
        order_number: `num_${Date.now()}`,
        state: 'pending',
        expiration_date: Math.floor(Date.now() / 1000) + 3600
      } as CulqiOrder;
    // }
    throw new Error('CULQI_PRIVATE_KEY not configured');
  }

  const response = await fetch(`${CULQI_API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${PRIVATE_KEY}`
    },
    body: JSON.stringify({
      amount,
      currency_code: currency,
      description,
      order_number: `appt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      client_details: clientDetails,
      expiration_date: Math.floor(Date.now() / 1000) + 24 * 60 * 60 // 24 hours
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Culqi Order Creation Failed:', errorBody);
    throw new Error('Failed to create payment order');
  }

  return response.json();
}
