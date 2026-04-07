import { useState, useEffect, useRef } from "react";
import "./HomePage.css";

export default function HomePage() {
  const [hovered, setHovered] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [alignOffset, setAlignOffset] = useState(0);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    function measure() {
      if (line1Ref.current && line2Ref.current) {
        const diff = line1Ref.current.offsetWidth - line2Ref.current.offsetWidth;
        setAlignOffset(diff / 2);
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [mounted]);

  // line2 ("skincare") translateX:
  //   center  → alignOffset      (centered under line1)
  //   left    → 0                (left-aligned)
  //   right   → alignOffset * 2  (right-aligned)
  const line2X =
    hovered === "right" ? 0
    : hovered === "left" ? alignOffset * 2
    : alignOffset;

  // line1 ("Sophisticated") always fills h1 width, but shift slightly for symmetry
  const line1X =
    hovered === "right" ? 0
    : hovered === "left" ? 0
    : 0;

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
        <h1 className={`home__title${hovered === "left" ? " home__title--move-right" : hovered === "right" ? " home__title--move-left" : ""}`}>
          <span ref={line1Ref} style={{ transform: `translateX(${line1X}px)` }}>
            Sophisticated
          </span>
          <span ref={line2Ref} style={{ transform: `translateX(${line2X}px)` }}>
            skincare
          </span>
        </h1>
      </div>

      {/* Left panel */}
      <div
        className={`home__side home__side--left ${hovered === "right" ? "home__side--hidden" : ""}`}
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
        className={`home__side home__side--right ${hovered === "left" ? "home__side--hidden" : ""}`}
        onMouseEnter={() => setHovered("right")}
        onMouseLeave={() => setHovered(null)}
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
