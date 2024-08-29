import React,{useEffect,useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import UserLayout from '../../layouts/user.layout';
import helpers from '../../helpers/helper.js';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const UserDashboard = () =>  {
	const [products,setProducts] = useState([]);
	const [quantity,setQuantity] = useState([]);
	const [inital,setInitial] = useState(0);
	const navigate = useNavigate();

	const allProducts = ()=>{
		const token = localStorage.getItem('token');
		const header = {Authorization:`Bearer ${token}`};
		axios.get(`${process.env.REACT_APP_USER_BASE_URL}/get-products`,{headers:header})
			.then((response)=>{
			 setProducts(response.data.products);
			 setQuantity(response.data.quantity);
			 console.log(response.data);
		}).catch((err)=>{
			console.log(err);
		});
	}
	
	//Add to cart
	const handleAddToCart = (e) =>{
		const product_id = e.target.value;
		axios.get(`${process.env.REACT_APP_USER_BASE_URL}/add-to-cart/${product_id}`,helpers.getHeaders())
		.then((response)=>{
			if(response.data.outStock)
			{
				Swal.fire({
					title: 'Product is out of Stock',
					showConfirmButton: true,
					showCancelButton: true,
					confirmButtonText: "OK",
					cancelButtonText: "Cancel",
					icon: 'warning'
				});
				return;
			}
			else if(response.data.success)
			{
				Swal.fire('Successfully added to cart', '', 'success').then((res)=>{
					navigate('/cart');
				});
			}
		}).catch((err)=>{
			console.log(err);
		});
	}
	const handleClick = (e) => {
		setInitial((initial)=>initial+1)
	}
	useEffect (()=>{
		allProducts();
	},[]);
	return (
		<UserLayout>
			<div>
				<div className='container'>
					<h2 className='text-center'>Products</h2>
					<div className='row'>
						<div className='col-md-10'></div>
						<div className='col-md-2'>
							<Link to='/cart'>My cart </Link>{quantity}
						</div>
					</div>
					<div className='row mt-2'>
						{products && products.length>0? 
							products?.map(item =>
								<div className='col-md-4 mt-4'>
									<p>{item?.name}</p>
									<p>Price: {item?.price}</p>
									<p>Quantity left: {item?.quantity}</p>
									<p> {item?.quantity>0 ? <button className='btn btn-success' onClick={handleAddToCart} value={item?.id}> Add to Cart +</button> : <span style={{color:'green'}}>Out of Stock</span>}</p>
								</div>
							
							)
						:''
						}	
					</div>
				</div>
				{/* <span>{inital}</span>
				<button onClick={handleClick}>Click</button> */}
			</div>
	  </UserLayout>
	);
}
  
export default UserDashboard;