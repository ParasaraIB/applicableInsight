import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Footer from "../components/Footer";

import { clearToken, loginAdmin } from "../store/actions/adminAction";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("manikparasara@gmail.com");
  const [password, setPassword] = useState("kantorpusat2023");

  const inputEmail = (e) => {
    setEmail(e.target.value);
  }

  const inputPassword = (e) => {
    setPassword(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Invalid input",
        text: "Please fill all the field!"
      });
    } else {
      const loginPayload = {
        email,
        password
      };

      dispatch(loginAdmin(loginPayload));
      setEmail("");
      setPassword("");
    }
  }

  const access_token = useSelector(state => state.adminReducer.access_token);

  useEffect(() => {
    if (access_token) {
      localStorage.setItem("access_token", access_token);
      dispatch(clearToken());
      navigate("/home");
      Swal.fire({
        icon: "info",
        iconColor: "#A5DC86",
        title: "Welcome back!",
        html: "<i>Kantor Perwakilan BI Provinsi NTT</i>",
        showConfirmButton: false,
        timer: 1500
      });
    }
  }, [access_token, dispatch, navigate]);

  return (
    <div>
      <div className="container d-flex align-items-center min-vh-100">
        <div className="card mx-auto" style={{ width: "25rem" }}>
          <div className="m-3 row mx-auto">
            <div className="col">
              <lottie-player src="https://assets1.lottiefiles.com/private_files/lf30_vamrx5qj.json" background="transparent" speed="1" style={{width: "150px", height: "150px"}} loop autoplay></lottie-player>
            </div>
          </div>
          <div className="row mx-auto">
            <h4>M-Doc</h4>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="m-3 row">
              <div className="col">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={inputEmail}
                />
              </div>
            </div>
            <div className="m-3 row">
              <div className="col">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={inputPassword}
                />
              </div>
            </div>
            <div className="m-3 row">
              <div className="col d-flex justify-content-end">
                <button type="submit" className="btn btn-dark">
                  Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="fixed-bottom">
        <Footer />
      </div>
    </div>
  );
};

export default Login;
