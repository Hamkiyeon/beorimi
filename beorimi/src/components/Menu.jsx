import React from "react";
import { useNavigate } from "react-router-dom";

export default function Menu({ menuOpen, setMenuOpen }) {
  const navigate = useNavigate();

  const movePage = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <>
      {menuOpen && (
        <div
          className="menu-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <nav className={`menu ${menuOpen ? "open" : ""}`}>
        <ul>
          <li>
            <button type="button" onClick={() => movePage("/")}>
              홈
            </button>
          </li>
          <li>
            <button type="button" onClick={() => movePage("/guide")}>
              분리배출 가이드
            </button>
          </li>
          <li>
            <button type="button" onClick={() => movePage("/disposal")}>
              폐기물 처리 정보
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}