import React,{useEffect,useState} from 'react';
import helpers from '../../helpers/helper';
import axios from 'axios';
import AdminLayout from '../../layouts/admin.layout';
  
  const AdminDashboard = () =>  {
	const [users,setUsers] = useState([]);
	const userInfo = localStorage.getItem('user');
	useEffect (()=>{
		const token   = localStorage.getItem('token');
		const header  = {Authorization : `Bearer ${token}`};
		//get all users
		axios.get(`${process.env.REACT_APP_ADMIN_BASE_URL}/all-users`,{headers : header})
		.then((response)=>{
			setUsers(response.data.users);
		}).catch((error)=>{
			console.log(error);
		});
	},[]);
	return (
		<AdminLayout>
			<>
			<div className='content'>
				welcome {helpers.decryption(userInfo)?.name}
					{
						users?.length>0 ?
							<div className='container'>
								<h3 className='text-center'>Users</h3>
								<div className='row'>
									<div className='col-md-3'>Name</div>
									<div className='col-md-3'>Email</div>
									<div className='col-md-3'>Created At</div>
								</div>
								{
									users?.map(item =>
										<div className='row'>
											<div className='col-md-3'>{item?.name}</div>
											<div className='col-md-3'>{item?.email}</div>
											<div className='col-md-3'>{item?.createdAt}</div>
										</div>
									)
								}
							</div>
						: null
					}
			</div>
			</>
	  </AdminLayout>
	);
  }
  
  export default AdminDashboard;