import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./TestingPage.css";

// d1 starts at 45°, d2 at ~85° (-7.8s into 70s cycle), d3 at ~125° (-20s into 90s cycle)
const DIAMONDS = [
  { size: 450, duration: 50, delay:    0, opacity: 0.55 },
  { size: 490, duration: 70, delay: -7.8, opacity: 0.28 },
  { size: 530, duration: 90, delay:  -20, opacity: 0.18 },
];

const STEPS = [
  { key: "name", label: "CLICK TO TYPE", placeholder: "Introduce Yourself" },
  { key: "city", label: "CLICK TO TYPE", placeholder: "Your City Name"      },
];

export default function TestingPage() {
  const navigate = useNavigate();
  const [mounted, setMounted]     = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues]       = useState({ name: "", city: "" });
  const [animState, setAnimState] = useState("idle"); // "idle" | "exit" | "enter"
  const [phase, setPhase]         = useState("input"); // "input" | "loading" | "done"
  const inputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Re-focus input whenever step changes
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [stepIndex]);

  const step = STEPS[stepIndex];

  function handleKeyDown(e) {
    if (e.key !== "Enter") return;
    const val = values[step.key].trim();
    if (!val) return;

    const nextIndex = stepIndex + 1;

    if (nextIndex >= STEPS.length) {
      // Last step — start loading phase
      setAnimState("exit");
      setTimeout(() => {
        setPhase("loading");
        setTimeout(() => setPhase("done"), 4000);
      }, 350);
      return;
    }

    // Phase 1: exit animation
    setAnimState("exit");
    setTimeout(() => {
      // Phase 2: swap step (invisible during gap)
      setStepIndex(nextIndex);
      setAnimState("enter");
      // Phase 3: clear after enter animation completes
      setTimeout(() => setAnimState("idle"), 500);
    }, 350);
  }

  return (
    <div className={`testing ${mounted ? "testing--mounted" : ""}`}>

      {/* Nav */}
      <nav className="testing__nav">
        <div className="testing__nav-left">
          <span className="testing__logo">SKINSTRIC</span>
          <svg width="4" height="17" viewBox="0 0 4 17" fill="none" aria-hidden="true">
            <line x1="1" y1="0" x2="1" y2="17" stroke="#1a1b1c" strokeWidth="1"/>
            <line x1="1" y1="0" x2="4" y2="0" stroke="#1a1b1c" strokeWidth="1"/>
            <line x1="1" y1="17" x2="4" y2="17" stroke="#1a1b1c" strokeWidth="1"/>
          </svg>
          <span className="testing__nav-label">INTRO</span>
          <svg width="4" height="17" viewBox="0 0 4 17" fill="none" aria-hidden="true">
            <line x1="3" y1="0" x2="3" y2="17" stroke="#1a1b1c" strokeWidth="1"/>
            <line x1="3" y1="0" x2="0" y2="0" stroke="#1a1b1c" strokeWidth="1"/>
            <line x1="3" y1="17" x2="0" y2="17" stroke="#1a1b1c" strokeWidth="1"/>
          </svg>
        </div>
        <button className="testing__enter-code">ENTER CODE</button>
      </nav>

      {/* Subtitle */}
      <p className="testing__subtitle">TO START ANALYSIS</p>

      {/* Rotating concentric diamonds */}
      <div className="testing__diamonds" aria-hidden="true">
        {DIAMONDS.map((d, i) => (
          <div
            key={i}
            className="testing__diamond"
            style={{
              width:      d.size,
              height:     d.size,
              marginTop:  -(d.size / 2),
              marginLeft: -(d.size / 2),
              opacity:    d.opacity,
              animation:  `rotateCW ${d.duration}s linear ${d.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Input — hidden during loading/done */}
      {phase === "input" && (
        <div className={`testing__input-wrap ${animState === "exit" ? "testing__input-wrap--exit" : animState === "enter" ? "testing__input-wrap--enter" : ""}`}>
          <span className="testing__click-label">{step.label}</span>
          <input
            ref={inputRef}
            key={step.key}
            className="testing__input"
            type="text"
            placeholder={step.placeholder}
            autoComplete="off"
            value={values[step.key]}
            onChange={e => setValues(v => ({ ...v, [step.key]: e.target.value }))}
            onKeyDown={handleKeyDown}
          />
        </div>
      )}

      {/* Loading phase */}
      {phase === "loading" && (
        <div className="testing__loading">
          <span className="testing__loading-text">processing submission</span>
          <div className="testing__dots">
            <span className="testing__dot" style={{ animationDelay: "0s" }} />
            <span className="testing__dot" style={{ animationDelay: "0.2s" }} />
            <span className="testing__dot" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
      )}

      {/* Done phase */}
      {phase === "done" && (
        <div className="testing__done">
          <p className="testing__thankyou">Thank You!</p>
          <p className="testing__proceed-hint">Proceed for the next step</p>
        </div>
      )}

      {/* Back */}
      <button className="testing__back" onClick={() => navigate("/")}>
        <div className="testing__back-diamond">
          <span className="testing__back-arrow">&#9664;</span>
        </div>
        <span className="testing__back-label">BACK</span>
      </button>

      {/* Proceed button — only on done phase */}
      {phase === "done" && (
        <button className="testing__proceed" onClick={() => navigate("/analysis")}>
          <span className="testing__proceed-label">PROCEED</span>
          <div className="testing__proceed-diamond">
            <span className="testing__proceed-arrow">&#9654;</span>
          </div>
        </button>
      )}

    </div>
  );
}
