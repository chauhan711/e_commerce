import React from 'react';
import {Navigate} from 'react-router-dom';
import AuthenticateUser from '../Authentication/AuthenticateUser.component.js';
  const ProtectedRoutes = () =>  {
	const token = localStorage.getItem('token');
	return (
	  token ? <AuthenticateUser/> : <Navigate to='/login' />
	);
  }
  
export default ProtectedRoutes;
  