import React, { useState } from 'react';
import './style.css'; // Make sure to create this CSS file
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const Login = () => {
    const navigate = useNavigate();
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");

    const Submit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8081/login', { email, password, })
            .then(res => {
                if (res.data.Status === "Success") {
                    localStorage.setItem('userEmail', res.data.email); // Store user email
                    localStorage.setItem('token', res.data.token); // Store the token
                    localStorage.setItem('refreshToken', res.data.refreshToken);
                    localStorage.setItem('userRole', res.data.role);


                    navigate('/');

                } else {
                    console.log("Login failed:", res.data);
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="form-container">
            <h2>Login form</h2>
            <form onSubmit={Submit}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder='enter valid email...'
                        onChange={e => setemail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder='enter password...'
                        onChange={e => setpassword(e.target.value)}

                    />
                </div>
                {/* <div className="form-group">
                    <label htmlFor="message">Message:</label>
                    <textarea
                        id="message"
                        email="message"

                    />
                </div> */}
                <button className='loginbtn' type="submit">Submit</button>
                <Link className='loginbtn' to="/Registrationform">Register</Link>


            </form>
        </div>
    );
};

export default Login;
