import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [hover, setHover] = useState(false);

  const toggleHover = () => {
    setHover(!hover);
  }

  let linkStyle;
  if (hover) linkStyle = "text-muted";
  else linkStyle = "text-dark";

  return (
    <div className="container footer mt-5">
      <div className="row mb-3">
        <div className="col text-center">
          <Link to="/about" style={{textDecoration: "none"}}>
            <span className={linkStyle} onMouseEnter={toggleHover} onMouseLeave={toggleHover}><i>Created by Ida Bagus (18176) - IT OJT &copy; 2022</i></span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Footer;