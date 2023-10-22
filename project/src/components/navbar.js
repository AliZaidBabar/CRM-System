import React from 'react';
import './style.css';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token'); // Remove the token as well
    navigate('/login_form');
  };

  const userEmail = localStorage.getItem('userEmail');
  const userRole = localStorage.getItem('userRole');
console.log('user email '+userEmail);
console.log('role :'+userRole);

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        {userEmail ? (
          <>


            <li>
              <Link to={userRole === 'admin' ? '/admin-dashboard' : '/user-profile'}>
                {userRole === 'admin' ? 'Admin Dashboard' : 'My Profile'}
              </Link>
            </li>



            <li>
              <button className='navbtn' onClick={handleLogout}>Logout</button>
            </li>
          </>

        ) : (
          <li>
            <Link to="/login_form">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
