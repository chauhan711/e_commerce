import React from 'react';
import logo from './logo.svg';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import './App.css';
import { Admin_Dashboard,User_Dashboard,Saler_Dashboard } from './helpers/dashboards.js';
import Login from './components/Login.component';
import PublicRoutes from './components/middlewares/PublicRoutes.component.js';
import ProtectedRoutes from './components/middlewares/ProtectedRoutes.component';
import DashboardPermission from './components/middlewares/DashboardPermission.component.js';
import AdminDashboard from './components/admin/adminDashboard.component';
import UserDashboard from './components/user/userDashboard.component.js';
import SalerDashboard from './components/saler/salerDashboard.component';
import Cart from './components/user/cart/cart.component.js';
import Logout from './components/logout.component.js';
import Allpayments from './components/admin/payments/allpayments.component.js';
import Refunded from './components/admin/payments/refunded.component.js';
import OrderProducts from './components/admin/payments/orderProducts.component.js';
import AllUsers from './components/admin/users/allUsers.component.js';
import UserOrders from './components/user/Orders/userOrders.component.js';
import GetHelp from './components/user/Help/getHelp.component.js';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoutes />}>
            <Route path='/' element={<Login />}/>
            <Route path='/login' element={<Login />}/>
          </Route>
          <Route element={<ProtectedRoutes/>}>
              <Route element={<DashboardPermission dashboard={Admin_Dashboard}/>} >
                <Route path='/admin-dashboard' element={<AdminDashboard />} />
                <Route path='/payments' element={<Allpayments/>} />
                <Route path='/order-products/:id' element={<OrderProducts/>} />
                <Route path='/all-users' element={<AllUsers/>} />
                <Route path='/refunded-payments' element={<Refunded/>} />
              </Route>

              <Route element={<DashboardPermission dashboard={Saler_Dashboard}/>} >
                <Route path='/saler-dashboard' element={<SalerDashboard />} />
              </Route>

              <Route element={<DashboardPermission dashboard={User_Dashboard}/>} >
                <Route path='/user-dashboard' element={<UserDashboard />} />
                <Route path='/cart' element={<Cart/>} />
                <Route path='/user-orders' element={<UserOrders/>} />
                <Route path='/get-help' element={<GetHelp/>} />
              </Route>
              <Route path='/logout' element={<Logout />}/>
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;