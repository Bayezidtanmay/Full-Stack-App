import axios from "axios";
import { useEffect, useState } from "react";

export function ListUser() {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        id: null,
        name: "",
        email: "",
        mobile: "",
    });

    useEffect(() => {
        getUsers();
    });

    function getUsers() {
        axios.get("http://localhost:8005/api/").then((response) => {
            setUsers(response.data);
        });
    }

    // delete from db, pretty similar to get method above ->

    const deleteUser = (id) => {
        axios
            .delete("http://localhost:8005/api/", {
                data: { id },
            })
            .then(() => getUsers());
    };

    // editing the data

    const changeInput = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
    };

    const editBtn = (user) => {
        setFormData(user);
        document.getElementById("editModal").style.display = "block";
    };

    const updateUser = () => {
        axios.put("http://localhost:8005/api/", formData).then(() => {
            getUsers();
            setFormData({ id: null, name: "", email: "", mobile: "" });
            document.getElementById("editModal").style.display = "none";
        });
    };
    return (
        <div>
            <h1>List Users</h1>

            <div id="editModal" className="modal">
                <span
                    className="closeButton"
                    onClick={() =>
                        (document.getElementById("editModal").style.display = "none")
                    }
                >
                    &times;
                </span>
                <h2>Edit User</h2>
                <input
                    name="name"
                    value={formData.name}
                    onChange={changeInput}
                    placeholder="Name"
                />
                <input
                    name="email"
                    value={formData.email}
                    onChange={changeInput}
                    placeholder="Email"
                />
                <input
                    name="mobile"
                    value={formData.mobile}
                    onChange={changeInput}
                    placeholder="Mobile"
                />
                <button className="updateButton" onClick={updateUser}>
                    Update
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, key) => (
                        <tr key={key}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.mobile}</td>
                            <td>
                                <div className="buttons">
                                    <button onClick={() => editBtn(user)}>Edit</button>
                                    <button onClick={() => deleteUser(user.id)}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListUser;