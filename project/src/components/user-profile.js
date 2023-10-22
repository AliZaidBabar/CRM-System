import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Link } from 'react-router-dom';
import AddProductForm from './addproduct';
import UserProducts from './userproduct';
function Userprofile() {
    const [userEmail, setUserEmail] = useState("");
    const [userAddress, setUserAddress] = useState("");
    const [userPic, setUserPic] = useState("");
    const [userContent, setUserContent] = useState("");
    const [imageError, setImageError] = useState(false);

    useEffect(() => {

        const storedEmail = localStorage.getItem('userEmail');
        setUserEmail(storedEmail);

        if (storedEmail) {
            axios.get(`http://localhost:8081/user/${storedEmail}`)
                .then(response => {
                    const userData = response.data;
                    setUserAddress(userData.address);
                    setUserPic(userData.pic);
                    setUserContent(userData.content);
                })
                .catch(error => {
                    console.error("Error fetching user data:", error);
                });
        }
    }, []);

    const handleImageError = () => {
        setImageError(true);
    };


    return (
        <div className='main'>
            <h1 className='main-heading'>
                ALL YOUR DETAILS ARE SHOWN HERE!            </h1>
            {userEmail && (
                <div className='user-details'>
                    <h3 className='detail'>Email: {userEmail}</h3>
                    <h3 className='detail'>Address: {userAddress}</h3>
                    <div className='user-pic'>
                        {userPic ? (
                            <img
                                className={`home-img fade-in-bottom`} 
                                src={`data:image/jpg/jpeg/png;base64,${userPic}`}
                                alt="Profile Picture"
                                onError={handleImageError}
                            />
                        ) : (
                            <div className='no-pic'>Profile picture not available</div>
                        )}
                    </div>

                    <h3 className='detail'>USER Description</h3>
                    <div className='user-content'>
                        <ReactQuill
                            value={userContent}
                            readOnly={true}
                            theme='bubble'
                            modules={{ toolbar: false }}
                        />
                    </div>
                    <div className='edit-btn'>
                        <Link to='/update'>Edit Profile</Link>
                    </div>
                    <AddProductForm />
                    <UserProducts />
                </div>
            )}
        </div>
    );
}

export default Userprofile;
