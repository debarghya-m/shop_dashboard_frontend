import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userId: "",
    password: "",
  });

  const onUpdateField = (e) => {
    const nextFormState = {
      ...form,
      [e.target.name]: e.target.value,
    };
    setForm(nextFormState);
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    if (form.password === "" || form.userId === "") {
      alert("Please enter correct details !");
    } else if (form.password === "9933" && form.userId === "deba") {
      localStorage.setItem("user", JSON.stringify(form));
      navigate("/home");
    } else {
      alert("Please enter correct details !");
    }
  };

  return (
    <form className="login__form" onSubmit={onSubmitForm}>
      <div className="login__form-field">
        <label className="form-lable">User Id</label>
        <input
          className="form-input"
          type="text"
          placeholder="Enter your user ID"
          name="userId"
          value={form.userId}
          onChange={onUpdateField}
        />
      </div>
      <div className="login__form-field">
        <label className="form-lable">Password</label>
        <input
          className="form-input"
          type="password"
          placeholder="Password field"
          name="password"
          value={form.password}
          onChange={onUpdateField}
        />
      </div>
      <div className="login__form-btn-grp">
        <button className="btn btn-primary" type="submit">
          Login
        </button>
      </div>
    </form>
  );
};

export default Login;
