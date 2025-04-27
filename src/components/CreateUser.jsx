import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs((values) => ({ ...values, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post("http://localhost:8005/api/", inputs);
        navigate("/");
    };

    return (
        <div>
            <h1>Create User</h1>
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <label>Name:</label>
                    <input type="text" name="name" onChange={handleChange} />
                    <label>Email:</label>
                    <input type="text" name="email" onChange={handleChange} />
                    <label>Mobile:</label>
                    <input type="number" name="mobile" onChange={handleChange} />
                    <br />
                    <button className="saveButton">Save</button>
                </form>
            </div>
        </div>
    );
};

export default CreateUser;