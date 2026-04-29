import React from "react";
import logo from "../assets/logo.jpeg";
import { useNavigate } from "react-router-dom";

export default function Header({ setMenuOpen }) {
  const navigate = useNavigate();

  return (
    <header>
      <h1>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="logo-btn"
        >
          <img src={logo} alt="버리미 로고" />
        </button>
      </h1>

      <button
        type="button"
        className="hamburger"
        onClick={() => setMenuOpen(true)}
      >
        &#9776;
      </button>
    </header>
  );
}