import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import Logout from '../components/logout.component';
const User = ({children}) =>  {
    const [loggedIn,setloggedIn] = useState(true);
    const handleLogout = ()=>{
        setloggedIn(null);
    }
	return (
	  <div>
        <header>
        <ul className='linkContainer'>
            <li class="navLink"><Link to="/user-dashboard">Home</Link></li>
            {/* <li><a href="#">News</a></li> */}
            <li class="navLink"><Link to="/user-orders">Orders</Link></li>
            <li class="navLink"><Link to="/get-help">Help</Link></li>
            <li class="navLink"><button onClick={handleLogout} className='logoutButton'>Logout</button></li>
            {!loggedIn && <Logout />}
        </ul>
        </header>
        <main>
            {children}
        </main>
        {/* <footer>
            <p>Author: John<br />
            <a href="mailto:hege@example.com">john@yopmail.com</a></p>
        </footer> */}
	  </div>
	);
}
  
export default User;
  