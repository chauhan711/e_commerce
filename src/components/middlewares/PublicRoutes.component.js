import React from 'react';
import {Outlet} from 'react-router-dom';
import RedirectIfAuthenticated from '../Authentication/RedirectIfAuthenticated.component.js';
  const PublicRoutes = () =>  {
    const token = localStorage.getItem('token');
	return (
            token ? <RedirectIfAuthenticated /> : <Outlet />
	);
}
export default PublicRoutes;