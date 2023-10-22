import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './style.css';

function Update() {
    const [userEmail, setUserEmail] = useState("");
    const [userAddress, setUserAddress] = useState("");
    const [userContent, setUserContent] = useState("");
    const [userPic, setUserPic] = useState(null); // New state for user profile picture
    const [updateSuccess, setUpdateSuccess] = useState(false);

    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        setUserEmail(storedEmail);

        if (storedEmail) {
            axios.get(`http://localhost:8081/user/${storedEmail}`)
                .then(response => {
                    const userData = response.data;
                    setUserAddress(userData.address);
                    setUserContent(userData.content);
                })
                .catch(error => {
                    console.error("Error fetching user data:", error);
                });
        }
    }, []);

    const handleUpdate = () => {
        const formData = new FormData();
        formData.append('email', userEmail);
        formData.append('address', userAddress);
        formData.append('content', JSON.stringify(userContent));

        if (userPic !== null) {
            formData.append('pic', userPic);
        }

        axios.post('http://localhost:8081/update', formData)
            .then(response => {
                setUpdateSuccess(true);
            })
            .catch(error => {
                console.error("Error updating user data:", error);
            });
    };


    return (
        <div>
            <h1>Update Your Details</h1>
            <div>
                <label htmlFor="address">Address:</label>
                <input
                    type="text"
                    id="address"
                    value={userAddress}
                    onChange={e => setUserAddress(e.target.value)}
                />
            </div>
            {/* <div>
                <label htmlFor="content">Description:</label>
                <textarea
                    id="content"
                    value={userContent}
                    onChange={e => setUserContent(e.target.value)}
                />
            </div> */}

            <div className="form-group">
                <label htmlFor="content">Description:</label>
                <ReactQuill
                    value={userContent}
                    onChange={value => setUserContent(value)}
                    modules={{
                        toolbar: [
                            [{ 'header': '1' }, { 'header': '2' }],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            ['bold', 'italic', 'underline', 'strike'],
                            ['link'],
                            [{ 'size': ['small', false, 'large', 'huge'] }], // Font size options
                        ],
                    }}
                    formats={[
                        'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike',
                        'blockquote', 'list', 'bullet', 'indent', 'link', 'image'
                    ]}
                />

            </div>


            <div>
                <label htmlFor="pic">Update Profile Picture:</label>
                <input
                    type="file"
                    id="pic"
                    onChange={e => setUserPic(e.target.files[0])}
                />
                <button onClick={() => setUserPic(null)}>Remove Profile Picture</button>
            </div>

            <button onClick={handleUpdate}>Update</button>
            {updateSuccess && <p>Update successful!</p>}
        </div>
    );
}

export default Update;
