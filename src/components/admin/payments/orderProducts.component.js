import React,{ useEffect, useState } from 'react';
import AdminLayout from '../../../layouts/admin.layout';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import helpers from '../../../helpers/helper';

const OrderProducts = () =>  {
	const [order,setOrder] = useState({});
	let {id} = useParams();
	const baseUrl = process.env.REACT_APP_ADMIN_BASE_URL;
	const getOrder = () => {
		axios.get(`${baseUrl}/get-order-products/${id}`,helpers.getHeaders())
		.then((resp)=>{
			console.log(resp);
			setOrder(resp.data.order);
		}).catch((err)=>{
			console.log(err);
		});
	}

	useEffect(()=>{
		//get order
		getOrder();
	},[])

	return (
	  <AdminLayout>
		<div className='container'>
			<h2 className='text-center'>Order Products</h2>
			<div className='row mt-3'>
				<div className='col-md-3'>Name</div>
				<div className='col-md-3'>Price</div>
				<div className='col-md-3'>Quantity</div>
				<div className='col-md-3'>Total Amount</div>
			</div>
			{
				Object.keys(order).length> 0 &&
				order?.products.map((item)=>
					<div className='row mt-2'>
						<div className='col-md-3'>{item?.name}</div>
						<div className='col-md-3'>${item?.price}</div>
						<div className='col-md-3'>{item?.order_products?.quantity}</div>
						<div className='col-md-3'>${item?.order_products?.quantity * item?.price}</div>
					</div>
				)
			}
		</div>
	  </AdminLayout>
	);
}
  
export default OrderProducts;