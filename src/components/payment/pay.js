import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentComponent from './PaymentComponent';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
const Pay = ({Amount}) =>  {
	return (
        <Elements stripe={stripePromise}>
            <PaymentComponent amount={Amount}/>
        </Elements>
	);
}
  
export default Pay;
  