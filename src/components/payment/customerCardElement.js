import React from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';

const CustomerCardElement = () => {
  const cardStyle = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  return (
    <form>
      <label>
        Card Number
        <CardNumberElement options={cardStyle} />
      </label>
      <label>
        Expiration Date
        <CardExpiryElement options={cardStyle} />
      </label>
      <label>
        CVC
        <CardCvcElement options={cardStyle} />
      </label>
    </form>
  );
};

export default CustomerCardElement;
