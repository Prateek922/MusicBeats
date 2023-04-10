import React from "react";
import { Link } from "react-router-dom";
import "../css/mystyles.css";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid  ">
        <Link className="navfont nav-link mx-3" to="/">
          Listen Anytime Anywhere
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav ms-auto">
            <Link
              className="navfont2 nav-link navbtn"
              aria-current="page"
              to="/"
            >
              Home
            </Link>
            <Link
              className="navfont2 nav-link navbtn"
              aria-current="page"
              to="/"
            >
              About Us
            </Link>
            <Link
              className="navfont2 nav-link navbtn"
              aria-current="page"
              to="/"
            >
              About Project
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
