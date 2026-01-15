import React, { useState } from 'react';
// Stripe integration will be added when payment gateway is configured
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentForm() {
  const [amount, setAmount] = useState(1000); // amount in cents
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Stripe payment processing will be implemented here
      alert('Payment gateway integration pending. This feature will be available soon.');
      /*
      const res = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (!data.clientSecret) throw new Error(data.error || 'No client secret');
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');
      // Redirect to Stripe Checkout or use Elements here
      alert('Payment Intent created! Client Secret: ' + data.clientSecret);
      */
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Amount (cents):
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          min={1}
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Pay'}
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
}
