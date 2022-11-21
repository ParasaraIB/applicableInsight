import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Footer from "../components/Footer";
import Loader from "../components/Loader";

import { clearToken, loginAdmin, showLoginLoading } from "../store/actions/adminAction";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isShowLoginLoading = useSelector(state => state.adminReducer.showLoginLoading);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      dispatch(showLoginLoading(true));
      dispatch(loginAdmin(loginPayload));
    }
  }

  const handleShowPassword = (e) => {
    setShowPassword(showPassword ? false : true);
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
        {
          isShowLoginLoading ? (
            <div className="mx-auto">
              <Loader />
            </div>
          ) : (
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
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        value={password}
                        onChange={inputPassword}
                      />
                      <span className="input-group-text">
                        <i className={showPassword ? "bi bi-eye-fill" : "bi bi-eye-slash-fill"} style={{cursor: "pointer"}} onClick={handleShowPassword}></i>
                      </span>
                    </div>
                    
                  </div>
                </div>
                <div className="m-3 row">
                  <div className="col">
                    <small>
                      <a href="https://wa.me/6287860414520" target="_blank" rel="noreferrer" style={{textDecoration: "none"}}>Butuh bantuan?</a>
                    </small>
                  </div>
                  <div className="col d-flex justify-content-end">
                    <button type="submit" className="btn btn-dark">
                      Login
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )
        }
      </div>
      <div className="fixed-bottom">
        <Footer />
      </div>
    </div>
  );
};

export default Login;
