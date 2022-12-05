import React from "react";

const Loader = () => {
  return (
    <div className="d-flex justify-content-center">
      <div className="spinner-border" role="status" style={{height: "4rem", width: "4rem", color: "#045498"}}>
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default Loader;