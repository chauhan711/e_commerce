import React,{useEffect,useState} from 'react';
import axios from 'axios';
import { Outlet,useNavigate } from 'react-router-dom';

const AuthenticateUser = () =>  {
    const [user,setUser] = useState(null);  
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(()=>{
            //verify that user is authorize or not
            axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/authenticate-user`,
                {headers:{Authorization:`Bearer ${token}`}})
                .then((response)=>{
                    localStorage.setItem('user',response.data.user);
                    setUser(true);
                }).catch((error)=>{
                    setUser(null);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
            });
    });

    return (
       user ? <Outlet /> : null
    );
}
export default AuthenticateUser;
  