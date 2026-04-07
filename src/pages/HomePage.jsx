import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`home ${mounted ? "home--mounted" : ""}`}>

      {/* Nav */}
      <nav className="home__nav">
        <div className="home__nav-left">
          <span className="home__logo">SKINSTRIC</span>
          <svg width="4" height="17" viewBox="0 0 4 17" fill="none" aria-hidden="true">
            <line x1="3" y1="0" x2="3" y2="17" stroke="#1a1b1c" strokeWidth="1"/>
            <line x1="3" y1="0" x2="0" y2="0" stroke="#1a1b1c" strokeWidth="1"/>
            <line x1="3" y1="17" x2="0" y2="17" stroke="#1a1b1c" strokeWidth="1"/>
          </svg>
          <span className="home__nav-intro">INTRO</span>
          <svg width="4" height="17" viewBox="0 0 4 17" fill="none" aria-hidden="true">
            <line x1="1" y1="0" x2="1" y2="17" stroke="#1a1b1c" strokeWidth="1"/>
            <line x1="1" y1="0" x2="4" y2="0" stroke="#1a1b1c" strokeWidth="1"/>
            <line x1="1" y1="17" x2="4" y2="17" stroke="#1a1b1c" strokeWidth="1"/>
          </svg>
        </div>
        <button className="home__enter-code">ENTER CODE</button>
      </nav>

      {/* Large side diamonds (viewport edges) */}
      <div className="home__side-diamond home__side-diamond--left" aria-hidden="true" />
      <div className="home__side-diamond home__side-diamond--right" aria-hidden="true" />

      {/* Hero */}
      <div className="home__hero">
        <h1 className="home__title">
          Sophisticated<br />skincare
        </h1>
      </div>

      {/* Left panel */}
      <div
        className={`home__side home__side--left ${hovered === "right" ? "home__side--faded" : ""}`}
        onMouseEnter={() => setHovered("left")}
        onMouseLeave={() => setHovered(null)}
      >
        <div className="home__btn-diamond">
          <span className="home__btn-arrow home__btn-arrow--left">&#9654;</span>
        </div>
        <span className="home__side-label">DISCOVER A.I.</span>
      </div>

      {/* Right panel */}
      <div
        className={`home__side home__side--right ${hovered === "left" ? "home__side--faded" : ""}`}
        onMouseEnter={() => setHovered("right")}
        onMouseLeave={() => setHovered(null)}
        onClick={() => navigate("/testing")}
      >
        <span className="home__side-label">TAKE TEST</span>
        <div className="home__btn-diamond">
          <span className="home__btn-arrow home__btn-arrow--right">&#9654;</span>
        </div>
      </div>

      {/* Bottom description */}
      <p className="home__description">
        SKINSTRIC DEVELOPED AN A.I. THAT CREATES A<br />
        HIGHLY-PERSONALIZED ROUTINE TAILORED TO<br />
        WHAT YOUR SKIN NEEDS.
      </p>

    </div>
  );
}
