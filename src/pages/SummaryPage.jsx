import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./pages.css";

const CIRCUMFERENCE = 2 * Math.PI * 155;

function DonutChart({ percentage }) {
  const target = Math.min(Math.max(percentage, 0), 100);
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    setDisplayed(0);
    const t = setTimeout(() => setDisplayed(target), 50);
    return () => clearTimeout(t);
  }, [target]);

  const offset = CIRCUMFERENCE - (CIRCUMFERENCE * displayed) / 100;

  return (
    <svg className="summary__donut" width="340" height="340" viewBox="0 0 340 340">
      <circle cx="170" cy="170" r="155" fill="none" stroke="#d0d0d0" strokeWidth="16" />
      <circle
        cx="170" cy="170" r="155"
        fill="none"
        stroke="#1a1b1c"
        strokeWidth="16"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.9s ease-in-out" }}
        transform="rotate(-90 170 170)"
      />
      <text
        x="170" y="176"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="64"
        fontFamily="Inter, sans-serif"
        fontWeight="400"
        fill="#1a1b1c"
      >
        {Math.round(target)}%
      </text>
    </svg>
  );
}

function normalizeDemographics(demo) {
  if (!demo) return null;
  const raw = demo.data ?? demo;

  function normalize(obj) {
    if (!obj || typeof obj !== "object") return {};
    const entries = Object.entries(obj);
    if (!entries.length) return {};
    const values = entries.map(([, v]) => Number(v));
    const max = Math.max(...values);
    const factor = max <= 1 ? 100 : 1;
    return Object.fromEntries(
      entries.map(([k, v]) => [k, Math.round(Number(v) * factor)])
    );
  }

  return {
    race: normalize(raw.race),
    age: normalize(raw.age),
    gender: normalize(raw.gender ?? raw.sex),
  };
}

function sortedEntries(obj) {
  return Object.entries(obj).sort(([, a], [, b]) => b - a);
}

function topKey(obj) {
  const entries = sortedEntries(obj);
  return entries[0]?.[0] ?? "—";
}

function displayName(key) {
  return String(key)
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const CATEGORY_DEFS = [
  { key: "race",   label: "RACE" },
  { key: "age",    label: "AGE"  },
  { key: "gender", label: "SEX"  },
];

function NavBracketLeft() {
  return (
    <svg width="4" height="17" viewBox="0 0 4 17" fill="none" aria-hidden="true">
      <line x1="1" y1="0" x2="1" y2="17" stroke="#1a1b1c" strokeWidth="1" />
      <line x1="1" y1="0" x2="4" y2="0" stroke="#1a1b1c" strokeWidth="1" />
      <line x1="1" y1="17" x2="4" y2="17" stroke="#1a1b1c" strokeWidth="1" />
    </svg>
  );
}

function NavBracketRight() {
  return (
    <svg width="4" height="17" viewBox="0 0 4 17" fill="none" aria-hidden="true">
      <line x1="3" y1="0" x2="3" y2="17" stroke="#1a1b1c" strokeWidth="1" />
      <line x1="3" y1="0" x2="0" y2="0" stroke="#1a1b1c" strokeWidth="1" />
      <line x1="3" y1="17" x2="0" y2="17" stroke="#1a1b1c" strokeWidth="1" />
    </svg>
  );
}

export default function SummaryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  const raw = location.state?.demographics;
  const demographics = normalizeDemographics(raw);

  const [activeCategory, setActiveCategory] = useState("race");
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Set initial active item once demographics loaded
  useEffect(() => {
    if (!demographics?.race) return;
    setActiveItem(topKey(demographics.race));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset active item when category changes
  useEffect(() => {
    if (!demographics) return;
    const catData = demographics[activeCategory];
    if (!catData) return;
    setActiveItem(topKey(catData));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  const catData = demographics?.[activeCategory] ?? {};
  const items = sortedEntries(catData);
  const selectedValue = catData[activeItem] ?? 0;

  return (
    <div className={`summary ${mounted ? "summary--mounted" : ""}`}>

      {/* Nav */}
      <nav className="summary__nav">
        <div className="summary__nav-left">
          <span className="summary__logo">SKINSTRIC</span>
          <NavBracketLeft />
          <span className="summary__nav-label">INTRO</span>
          <NavBracketRight />
        </div>
        <button className="summary__enter-code">ENTER CODE</button>
      </nav>

      {/* Header */}
      <div className="summary__header">
        <p className="summary__ai-label">A.I. ANALYSIS</p>
        <h1 className="summary__title">DEMOGRAPHICS</h1>
        <p className="summary__subtitle">PREDICTED RACE &amp; AGE</p>
      </div>

      {/* Content row */}
      <div className="summary__content">

        {/* Left sidebar */}
        <div className="summary__sidebar">
          {CATEGORY_DEFS.map((cat) => {
            const isActive = activeCategory === cat.key;
            const top = demographics ? displayName(topKey(demographics[cat.key] ?? {})) : "—";
            return (
              <button
                key={cat.key}
                className={`summary__sidebar-item${isActive ? " summary__sidebar-item--active" : ""}`}
                onClick={() => setActiveCategory(cat.key)}
              >
                <span className="summary__sidebar-value">{top}</span>
                <span className="summary__sidebar-label">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Center panel */}
        <div className="summary__center">
          <span className="summary__center-label">
            {activeItem ? displayName(activeItem) : ""}
          </span>
          <div className="summary__donut-wrapper">
            <DonutChart percentage={selectedValue} />
          </div>
        </div>

        {/* Right panel */}
        <div className="summary__right">
          <div className="summary__right-header">
            <span>{CATEGORY_DEFS.find((c) => c.key === activeCategory)?.label}</span>
            <span>A.I. CONFIDENCE</span>
          </div>
          <div className="summary__right-list">
            {items.map(([key, value]) => {
              const isActive = key === activeItem;
              return (
                <button
                  key={key}
                  className={`summary__right-item${isActive ? " summary__right-item--active" : ""}`}
                  onClick={() => setActiveItem(key)}
                >
                  <span className="summary__right-diamond">{isActive ? "◆" : "◇"}</span>
                  <span className="summary__right-name">{displayName(key)}</span>
                  <span className="summary__right-pct">{Math.round(value)}%</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="summary__footer">
        <button className="summary__back" onClick={() => navigate(-1)}>
          <div className="summary__nav-diamond">
            <span className="summary__nav-arrow">&#9664;</span>
          </div>
          <span>BACK</span>
        </button>
        <p className="summary__footer-text">
          If A.I. estimate is wrong, select the correct one.
        </p>
        <button className="summary__home" onClick={() => navigate("/")}>
          <span>HOME</span>
          <div className="summary__nav-diamond">
            <span className="summary__nav-arrow">&#9654;</span>
          </div>
        </button>
      </div>

    </div>
  );
}
