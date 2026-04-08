import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SelectPage.css";

export default function SelectPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  const [cellHovered, setCellHovered] = useState(false);
  const activeCell = useRef(null);
  const timer = useRef(null);

  function handleCellEnter(idx) {
    clearTimeout(timer.current);
    const wasHovering = activeCell.current !== null;
    activeCell.current = idx;
    if (wasHovering) {
      // Retract first, then pop out on the new cell
      setCellHovered(false);
      timer.current = setTimeout(() => setCellHovered(true), 120);
    } else {
      setCellHovered(true);
    }
  }

  function handleCellLeave() {
    // Short delay so moving between cells doesn't trigger a retract
    timer.current = setTimeout(() => {
      activeCell.current = null;
      setCellHovered(false);
    }, 40);
  }

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`select ${mounted ? "select--mounted" : ""}`}>

      {/* Nav */}
      <nav className="select__nav">
        <div className="select__nav-left">
          <span className="select__logo">SKINSTRIC</span>
          <svg width="4" height="17" viewBox="0 0 4 17" fill="none" aria-hidden="true">
            <line x1="1" y1="0" x2="1" y2="17" stroke="#1a1b1c" strokeWidth="1"/>
            <line x1="1" y1="0" x2="4" y2="0" stroke="#1a1b1c" strokeWidth="1"/>
            <line x1="1" y1="17" x2="4" y2="17" stroke="#1a1b1c" strokeWidth="1"/>
          </svg>
          <span className="select__nav-label">INTRO</span>
          <svg width="4" height="17" viewBox="0 0 4 17" fill="none" aria-hidden="true">
            <line x1="3" y1="0" x2="3" y2="17" stroke="#1a1b1c" strokeWidth="1"/>
            <line x1="3" y1="0" x2="0" y2="0" stroke="#1a1b1c" strokeWidth="1"/>
            <line x1="3" y1="17" x2="0" y2="17" stroke="#1a1b1c" strokeWidth="1"/>
          </svg>
        </div>
        <button className="select__enter-code">ENTER CODE</button>
      </nav>

      {/* Heading */}
      <div className="select__heading">
        <h2 className="select__title">A.I. ANALYSIS</h2>
        <p className="select__subtitle">A.I. HAS ESTIMATED THE FOLLOWING.</p>
        <p className="select__subtitle">FIX ESTIMATED INFORMATION IF NEEDED.</p>
      </div>

      {/* Diamond grid — 2×2 square rotated 45° */}
      <div className="select__grid-wrapper">
        {/* Hover ring — scales out from center when any cell is hovered */}
        <div className={`select__hover-ring ${cellHovered ? "select__hover-ring--visible" : ""}`} />
        <div className="select__grid">
          <button
            className="select__cell"
            onMouseEnter={() => handleCellEnter(0)}
            onMouseLeave={handleCellLeave}
          >
            <span>DEMOGRAPHICS</span>
          </button>
          <button
            className="select__cell"
            onMouseEnter={() => handleCellEnter(1)}
            onMouseLeave={handleCellLeave}
          >
            <span>SKIN TYPE DETAILS</span>
          </button>
          <button
            className="select__cell"
            onMouseEnter={() => handleCellEnter(2)}
            onMouseLeave={handleCellLeave}
          >
            <span>COSMETIC<br />CONCERNS</span>
          </button>
          <button
            className="select__cell"
            onMouseEnter={() => handleCellEnter(3)}
            onMouseLeave={handleCellLeave}
          >
            <span>WEATHER</span>
          </button>
        </div>
      </div>

      {/* Bottom nav */}
      <button className="select__back" onClick={() => navigate(-1)}>
        <div className="select__nav-diamond">
          <span className="select__nav-arrow">&#9664;</span>
        </div>
        <span>BACK</span>
      </button>

      <button className="select__summary" onClick={() => navigate("/summary")}>
        <span>GET SUMMARY</span>
        <div className="select__nav-diamond">
          <span className="select__nav-arrow">&#9654;</span>
        </div>
      </button>

    </div>
  );
}
