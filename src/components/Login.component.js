import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import helpers from '../helpers/helper.js';
import {Super_Admin,Admin,User,Saler} from '../helpers/roles.helpers.js';
import Swal from 'sweetalert2';

function Login() {
  const navigate = useNavigate();
  const keys = ({email:'',password:''});
  const [formData,setFormData] = useState(keys);
  const [error,setError] = useState(keys);

  //after successfully email login
  const responseMessage = (response) => {
    //login with google
    axios.post(`${process.env.REACT_APP_PUBLIC_BASE_URL}/google-auth`,response).then((resp) => {
      //set token in local storage
      localStorage.setItem('token',resp.data.token);
      navigate('/dashboard');
    }).catch((err) => console.log('errors',err));
  };

  //after error from email
  const errorMessage = (error) => {
      console.log(error);
      alert('Something went wrong');
  };

  //set form data
  const handleChange = (e)=>{
    const {name,value} = e.target;
    setFormData({...formData,[name]:value});
  }

  //Login
  const handleSubmit = (e) => {
    let error = null;
    if(formData.email == '')
    {
      error = true;
      setError((error)=>({...error,email:'Email is required.'}))
    }
    if(formData.password == '')
    {
      error = true;
      setError((error)=>({...error,password:'Password is required.'}))
    }
    if(!error){
      axios.post(`${process.env.REACT_APP_PUBLIC_BASE_URL}/login`,formData)
      .then((response)=>{
        localStorage.setItem('token',response.data.token);
        const user = helpers.decryption(response.data.user);
        if(helpers.checkRole(user,Super_Admin) || helpers.checkRole(user,Admin))
        {
          navigate('/admin-dashboard');
        }
        else if(helpers.checkRole(user,Saler))
        {
          navigate('/saler-dashboard');
        }
        else if(helpers.checkRole(user,User))
        {
          navigate('/user-dashboard');
        }
      }).catch((err)=>{
        console.log(err);
        Swal.fire(err.response.data.error,'','error');
        setFormData(keys);
      });
   }
  }

  return (
    <div className='container w-50'>
        <div className='container'>
          <div className='row mt-5'>
            <label> Email</label>
            <input type='text' name="email" placeholder='Enter your email' onChange={handleChange} value={formData?.email}/>
            <span style={{color:'red'}}>{error?.email}</span>
          </div>
          <div className='row mt-3'>
            <label> Password </label>
            <input type='text' name="password" placeholder='Enter your password' onChange={handleChange} value={formData?.password}/>
            <span style={{color:'red'}}>{error?.password}</span>
          </div>
          <button className='m-2 btn btn-primary' onClick={handleSubmit}>Login</button>
           <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
        </div>
    </div>
  );
}
export default Login;