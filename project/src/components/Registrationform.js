import React, { useState } from 'react';
import './style.css'; // Make sure to create this CSS file
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const Register = () => {

    const navigate = useNavigate()
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [address, setaddress] = useState("");
    const [pic, setPic] = useState("");
    const [content, setContent] = useState("enter content..."); // Rich text content


    const handleImageChange = (e) => {
        setPic(e.target.files[0]);
    }

    const handleContentChange = (value) => {
        setContent(value);
    }
    // const Submit = (e) => {
    //     e.preventDefault()
    //     axios.post('http://localhost:8081/register', { email, password,address,pic })
    //         .then(res => {
    //             navigate('/login_form')
    //         }).catch(err => console.log(err))
    // }

    const Submit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('address', address);
        formData.append('pic', pic);
        formData.append('content', JSON.stringify(content)); // Include rich text content

        try {
            await axios.post('http://localhost:8081/register', formData);
            navigate('/login_form');
        } catch (error) {
            console.log(error);
        }
    };





    const CustomToolbar = () => (
        <div id="toolbar">
            <select className="ql-size">
                <option value="small" />
                <option value="normal" />
                <option value="large" />
                <option value="huge" />
                <option value="10px">10px</option>
                <option value="12px">12px</option>
                <option value="16px">16px</option>
                <option value="20px">20px</option>
                <option value="24px">24px</option>
                <option value="28px">28px</option>
            </select>
            <button className="ql-bold"></button>
            <button className="ql-italic"></button>
            <button className="ql-underline"></button>
            <button className="ql-strike"></button>
            <button className="ql-link"></button>
        </div>
    );




    return (
        <div className="form-container">
            <h2>Registeration</h2>
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
                <div className="form-group">
                    <label htmlFor="address">Address:</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        placeholder='enter address...'
                        onChange={e => setaddress(e.target.value)}

                    />
                </div>
                <div className="form-group">
                    <label htmlFor="pic">Add Picture:</label>
                    <input
                        type="file"
                        id="pic"
                        name="pic"
                        onChange={handleImageChange}

                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">Description:</label>
                    <ReactQuill
                        value={content}
                        onChange={handleContentChange}
                        modules={{
                            toolbar: [
                                [{ 'header': '1' }, { 'header': '2' }],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                ['bold', 'italic', 'underline', 'strike'],
                                ['link'],
                                [{ 'size': ['small', false, 'large', 'huge'] }], // Font size options
                            ],
                        }}
                    />

                </div>
                {/* <div className="form-group">
                    <label htmlFor="message">Message:</label>
                    <textarea
                        id="message"
                        email="message"

                    />
                </div> */}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Register;
