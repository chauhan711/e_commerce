import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {useStripe, useElements,CardNumberElement,CardExpiryElement, CardCvcElement,stripePower } from '@stripe/react-stripe-js';
import Swal from 'sweetalert2';

const PaymentComponent = ({amount}) =>  {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [cardToken,setCardToken] = useState(null);
    const navigate = useNavigate();
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

    const handleSubmit = async (event) => {
      event.preventDefault();
      if (!stripe || !elements) {
        return;
      }
      const cardElement = elements.getElement(CardNumberElement);
      try {
        const {token}  = await stripe.createToken(cardElement);
        if(!token)
        {
          Swal.fire('Please fill authorized card information', '', 'error');
          return;
        }
        else{
          setCardToken(token);
          // verifyOtp();
          makePayment(token);
        }
      } catch (error) {
        console.log('error')
        Swal.fire('Something went wrong', '', 'error');
      }
    };

    const verifyOtp = async () =>{
      const userToken = localStorage.getItem('token');
      axios.post(`${process.env.REACT_APP_USER_BASE_URL}/generate-otp`,
        {
          headers : {Authorization:`Bearer ${userToken}`}
        })
      .then((response) => {
          
      }).catch((err)=>{

      });
    }

    const makePayment = (cardToken) =>{
      const userToken = localStorage.getItem('token');
      const data =  {
                      amount: amount * 100, // Amount in cents
                      cardToken,
                    };
      //make payment api
      axios.post(`${process.env.REACT_APP_USER_BASE_URL}/payment`,
        data,
        {
          headers : {Authorization:`Bearer ${userToken}`}
        })
        .then((response) => {
        Swal.fire('Payment successfully received', '', 'success').then((res)=>{
          navigate('/user-dashboard');
        });
      }).catch((err)=>{
        Swal.fire('Payment is failed', '', 'error');
      });;
    }
  
	return (
        <form onSubmit={handleSubmit} className='payment_form mt-3' style={{textAlign:'end'}}>
          <div className='row'>
            <label className='col-md-2'>Card Number</label>
              <div className='col-md-6'><CardNumberElement options={cardStyle} /></div>
          </div>
          <div className='row mt-2'>
            <label className='col-md-2'>Expiry Date</label>
              <div className='col-md-6'><CardExpiryElement options={cardStyle} /></div>
          </div>
          <div className='row mt-2'>
            <label className='col-md-2'>CVV</label>
              <div className='col-md-6'><CardCvcElement options={cardStyle} /></div>
          </div>
          <div className='row mt-2'>
              <div className='col-md-3'><button type="submit" className='btn btn-primary' disabled={!stripe}>Pay ${amount}</button></div>
              <div className='col-md-5'></div>
          </div>
          {error && <div>{error}</div>}
        </form>
	);
}
  
export default PaymentComponent;
  