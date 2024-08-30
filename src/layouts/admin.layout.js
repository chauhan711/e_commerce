import React,{useState} from 'react';
import Logout from '../components/logout.component';
import { Link } from 'react-router-dom';
  
const Admin = ({children}) =>  {
	const [loggedIn,setloggedIn] = useState(true);
    const handleLogout = ()=>{
        setloggedIn(null);
    }
	return (
		<div>
			<div class="sidebar">
				<Link to="/admin-dashboard">Home</Link>
				<Link to='/payments'>Orders</Link>
				<Link to='/all-users'>Users</Link>
				<Link to='/user-chat'>Chat</Link>
				<button className='btn btn-primary' onClick={handleLogout}>Logout</button>
				{!loggedIn && <Logout />}
			</div>
			{children}
		</div>
	);
}

export default Admin;