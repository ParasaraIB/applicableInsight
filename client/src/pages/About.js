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
        <div className="col d-flex align-items-center">
          <h3 style={{cursor: "pointer", color: "#045498"}} onClick={handleBack}><i className="bi bi-arrow-left"></i></h3>
          <h5 className="ms-4" style={{color: "#045498"}}>Back to Mainpage</h5>
        </div>
        <hr />
      </div>
      <div className="row">
        <div className="col-6">
          <p style={{padding: 0, margin: 0}}><i>“Jalan-jalan ke Kota Jepang jangan lupa beli kerupuk,</i></p>
          <p style={{padding: 0, margin: 0}}><i>“Buat apa kita ke Jepang kalau cuma beli kerupuk” </i></p>
          <h6 className="mt-3"><i>18176 - Ida Bagus Ngurah Manik Parasara</i></h6>
        </div>
      </div>
      <div className="row">
        <div className="col d-flex">
          <a href="https://www.linkedin.com/in/gusraja21/" target="_blank" rel="noreferrer"><h3><i className="bi bi-linkedin"></i></h3></a>
          <a href="https://wa.me/6287860414520" target="_blank" rel="noreferrer" className="ms-3"><h3><i className="bi bi-whatsapp"></i></h3></a>
        </div>
      </div>
    </div>
  );
}

export default About;