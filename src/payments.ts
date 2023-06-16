import { createClient } from '$utils/client';

declare const STRIPE_KEY: string;

const init = async () => {
  const { isLoggedIn, client } = await createClient(true);

  const access_token = await client.getTokenSilently();

  // Create the payment intent
  const payment_intent = await createPaymentIntent(access_token);
  if (!payment_intent) return;

  console.log({ payment_intent });

  // Mount the stripe payment form
  const stripe = window.Stripe?.(STRIPE_KEY);
  if (!stripe) return;

  const form = document.querySelector<HTMLFormElement>('[data-element="payment_form"]');
  if (!form) return;

  const stripePlaceholder = form.querySelector<HTMLElement>('[data-element="stripe"]');
  if (!stripePlaceholder) return;

  const elements = stripe.elements({
    clientSecret: payment_intent.client_secret,
  });

  const paymentElement = elements.create('payment');
  paymentElement.mount(stripePlaceholder);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    await elements.submit();

    const result = await stripe.confirmPayment({
      elements,
      clientSecret: payment_intent.client_secret,
      redirect: 'if_required',
    });

    console.log({ result });
  });
};

const createPaymentIntent = async (access_token: string) => {
  try {
    const response = await fetch('http://localhost:8787/create-subscription', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_id: 'price_1NEYSIHeSJDr25TuPc6SWdtv',
      }),
    });
    console.log({ response });

    const data: { subscription_id: string; client_secret: string } = await response.json();
    return data;
  } catch (err) {
    return null;
  }
};

init();
