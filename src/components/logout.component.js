import React,{useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
  
const Logout = () =>  {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    useEffect(()=>{
        const header = {Authorization : `Bearer ${token}`};
        axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/logout`,{headers:header}).
        then((response)=>{
            if(response.data.success)
            {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                navigate('/login');
            }
        }).catch((err)=>{
            console.log(err);
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            navigate('/login');
        });
    });
	return (
	  <div>
	  </div>
	);
}
  
export default Logout;
  