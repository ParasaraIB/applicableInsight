import React from "react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const handleBack = (e) => {
    navigate(-1);
  }

  return (
    <div className="container mt-5 text-left">
      <div className="row">
        <h3 style={{cursor: "pointer"}} onClick={handleBack}><i className="bi bi-arrow-left"></i></h3>
      </div>
      <div className="row">
        <div className="col-6">
          <h1 className="text-danger mt-5">404: Not Found</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <h4 className="mt-2">OJT PCPM 36</h4>
          <p><i>Ida Bagus Ngurah Manik Parasara</i></p>
          <a href="https://www.linkedin.com/in/gusraja21/" target="_blank" rel="noreferrer"><h3><i className="bi bi-linkedin"></i></h3></a>
        </div>
      </div>
    </div>
  );
}

export default About;