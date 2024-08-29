import React,{useEffect,useState} from 'react';
import helpers from '../../../helpers/helper';
import axios from 'axios';
import Pay from '../../payment/pay';  
import UserLayout from '../../../layouts/user.layout';
import Payment from '../../paypal/payment.payal';

const Cart = () =>  {
    const [userproducts,setUserproducts] = useState(null);
    const [totalAmt,setTotalAmt] = useState(null)
    const [quantity,setQuantity] = useState(0);
    const [paymentReady,setpaymentReady] = useState(null);
    const [paypalPay,setpaypalPay] = useState(null);


    const handlePay = (e) =>{
        setpaymentReady(true);
    }
    const handlePaypalCheckout = (e) => {
        setpaypalPay(true);
    }
    useEffect(()=>{
        const user = helpers.getCurrentUser();
        const token =  localStorage.getItem('token');
        const header = {Authorization:`Bearer ${token}`};
        axios.get(`${process.env.REACT_APP_USER_BASE_URL}/get-user-products`,{headers :header})
        .then((response)=>{
            setUserproducts(response.data.products);
            setTotalAmt(response.data.totalAmt);
            setQuantity(response.data.quantity);
        }).catch((err)=>{
            console.log(err);
        });
    },[]);
	return (
    <UserLayout>
	  <div>
            <div className='container'>
                <h2 className='text-center'>Cart</h2>
                <div className='row'>
                    <div className='col-md-3'>Name</div>
                    <div className='col-md-3'>Price</div>
                    <div className='col-md-3'>Quantity</div>
                    <div className='col-md-3'>Total</div>
                </div>
                {
                    userproducts? 
                    userproducts?.products?.map(item=>
                        <div className='row'>
                            <div className='col-md-3'>{item?.name}</div>
                            <div className='col-md-3'>$ {item?.price}</div>
                            <div className='col-md-3'>{item?.users_products?.quantity}</div>
                            <div className='col-md-3'>$ {item?.price * item?.users_products?.quantity}</div>
                        </div>
                        )
                    :''
                }
                <hr />
                <div className='row'>
                    <div className='col-md-9'>Total</div>
                    <div className='col-md-3'>$ {totalAmt}</div>
                </div>
                {
                (quantity > 0 && !paypalPay)&&
                    // <button onClick={handlePay} className='btn btn-success'>Checkout</button> (For Stripe)
                    <button onClick={handlePaypalCheckout} className='btn btn-success'>Checkout</button>
                }
                {
                    paymentReady && <Pay Amount={totalAmt}/>
                }
                <div>
                 {paypalPay && <Payment />}
                </div>
            </div>
	  </div>
      </UserLayout>
	);
  }
  
export default Cart;
  