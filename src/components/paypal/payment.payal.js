import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Swal from 'sweetalert2';

const Payment = () =>  {
    const token =  localStorage.getItem('token');
    const navigate = useNavigate();
    function createOrder() {
        return fetch(`${process.env.REACT_APP_USER_BASE_URL}/create-payment-paypal`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization:`Bearer ${token}`
            },
            
        })
            .then((response) => response.json())
            .then((order) => order.orderID);
    }
    function onApprove(data) {
        return fetch(`${process.env.REACT_APP_USER_BASE_URL}/capture-paypal-order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:`Bearer ${token}`
          },
          body: JSON.stringify({
            orderID: data.orderID
          })
        })
        .then((response) => response.json())
        .then((orderData) => {
            // console.log(orderData.result.);
            const name = orderData.result.payer.name.given_name;
            Swal.fire({
                title: `Transaction completed by ${name}`,
                showConfirmButton: true,
                confirmButtonText: "OK",
                icon: 'success'
            }).then((res)=>{
                navigate('/user-dashboard');
            });
        });
    
    }
    
    return (
        <div key={1}>
            <PayPalScriptProvider options={{ clientId: "AXzXikAFC3jt6oOOE6VqajfrUF3wX-gVcd7DA4wan26noU8uG2cVeElNa60kcWR-PJUgIIZ__LG0W3Y7" }}>
                <PayPalButtons createOrder={createOrder} onApprove={onApprove}/>
            </PayPalScriptProvider>
        </div>
    );
}

  export default Payment;
  