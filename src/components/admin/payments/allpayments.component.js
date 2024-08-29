import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../layouts/admin.layout';
import axios from 'axios';
import helpers from '../../../helpers/helper';
import Swal from 'sweetalert2';
import Order from './orders.component';

const Allpayments = () =>  {
    const navigate = useNavigate();
    const [orders,setOrders] = useState([]);
    const [searchOrders,setSearchOrders] = useState('');

    //for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage, setOrdersPerPage] = useState(2);

    const handleFindProduct = (orderId) =>{
        // console.log(e);
        navigate(`/order-products/${orderId}`)
    }
    //refund functionality
    const handleRefund = (e)=>{
        Swal.fire({
            title: 'Do you want to Refund the money?',
            showDenyButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
            customClass: {
              actions: 'my-actions',
              confirmButton: 'order-2',
              denyButton: 'order-3',
            },
          }).then((result) => {
            if (result.isConfirmed) {
            const Ordercharge = e.target.value;
                axios.get(`${process.env.REACT_APP_ADMIN_BASE_URL}/refundPayment/${Ordercharge}`,helpers.getHeaders())
                .then((resp)=>{
                    console.log(resp);
                    Swal.fire('Successfully Refund', '', 'success').then((resp)=>{
                        // navigate('/refunded-payments')
                        getAllOrders();
                    });
                }).catch((err)=>{
                    console.log(err);
                });
            } else if (result.isDenied) {
                // Swal.fire("", '', 'info')
            }
          });
    }

    //get all orders
    const getAllOrders = () =>{
        axios.get(`${process.env.REACT_APP_ADMIN_BASE_URL}/get-payments`,helpers.getHeaders())
        .then((resp)=>{
            setOrders(resp.data.orders);
            // console.log(resp.data.orders);
        }).catch((err)=>{
            console.log(err);
        });
    }

    //change page number of orders
    const changePageNo =(pageNo)=>{
        setCurrentPage(pageNo);
    }
    //orders per page
    const handleOrderPerPage = (e) => {
        if(e.target.value !='')
        {
         setOrdersPerPage(e.target.value)
        }
    }
    //for filteration
    const handleSearch = (e) =>{
        const {value} = e.target
        setSearchOrders(value);
    }

    useEffect (()=>{
        getAllOrders();
    },[]);
	return (
      <AdminLayout>
	    <div className='content'>
            <div className='container'>
            <h2 className='text-center'>Orders</h2>
            <div className='row'>
                <div className='col-md-9'></div>
                <div className='col-md-3'>
                    <input type='text' name="search" placeholder='search' onChange={(e)=>handleSearch(e)}/>
                    <select onChange={(e)=>handleOrderPerPage(e)} style={{color:'blue'}}>
                        <option value=''>orders per page</option>
                        <option value='5'>5</option>
                        <option value='10'>10</option>
                        <option value='20'>20</option>
                        <option value='50'>50</option>
                    </select>
                </div>
            </div>
                <Order 
                 orders={orders} 
                 handleFindProduct={handleFindProduct} 
                 handleRefund={handleRefund} 
                 currentPage = {currentPage}
                 ordersPerPage = {ordersPerPage}
                 changePageNo={changePageNo}
                 searchOrders={searchOrders}
                />
                
            </div>
	    </div>
      </AdminLayout>
	);
}
  
export default Allpayments;
  