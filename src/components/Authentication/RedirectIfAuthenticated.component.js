import React,{useEffect,useState} from 'react';
import { useNavigate ,Outlet} from 'react-router-dom';
import axios from 'axios';
import helpers from '../../helpers/helper';
import {Admin_Dashboard,User_Dashboard,Saler_Dashboard} from '../../helpers/dashboards'
const RedirectIfAuthenticated = () =>  {
    const navigate = useNavigate();
    const [user,setUser] = useState(true);
    useEffect(()=>{
        //verify token and redirect to dashboard back
        const token = localStorage.getItem('token');
        //Verify user
        axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/authenticate-user`,
        {headers:{Authorization:`Bearer ${token}`}})
        .then((response)=>{
            const user = helpers.decryption(response.data.user);
            if(helpers.checkPermission(user,Admin_Dashboard))
            {
                navigate('/admin-dashboard');
            }
            else if(helpers.checkPermission(user,Saler_Dashboard))
            {
                navigate('/saler-dashboard');
            }
            else if(helpers.checkPermission(user,User_Dashboard))
            {
                navigate('/user-dashboard');
            }
            else{
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            }
        }).catch((error)=>{
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        });
    });
	return (
        user ? null : <Outlet />
	);
}
export default RedirectIfAuthenticated;
  