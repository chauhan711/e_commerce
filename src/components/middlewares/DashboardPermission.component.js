import React,{useState,useEffect} from 'react';
import { useNavigate,Outlet } from 'react-router-dom';
import { Super_Admin,Admin,User,Saler } from '../../helpers/roles.helpers';
import {Admin_Dashboard,Saler_Dashboard,User_Dashboard} from '../../helpers/dashboards';
import helpers from '../../helpers/helper';

  const DashboardPermission = ({dashboard}) =>  {
    const [authUser,setAuthUser] = useState(null);
    const navigate = useNavigate();
    useEffect (()=>{
        const user = localStorage.getItem('user');
        let roles = {};
        if(dashboard === Admin_Dashboard)
        {
            roles = {Super_Admin,Admin};
        }
        else if(dashboard === Saler_Dashboard)
        {
            roles = {Saler};
        }
        else if(dashboard === User_Dashboard)
        {
            roles = {User};
        }
        //verifing role in dashboard allow roles
        if(helpers.verifyRole(user,roles))
        {
            setAuthUser(true);
        }
        else{
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    },[]);
	return (
        authUser && <Outlet/>
	);
  }
  
  export default DashboardPermission;