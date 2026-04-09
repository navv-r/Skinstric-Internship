import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./pages.css";

const DIAMONDS = [
  { size: 300, duration: 50, delay:    0, opacity: 0.55 },
  { size: 340, duration: 70, delay: -7.8, opacity: 0.28 },
  { size: 380, duration: 90, delay:  -20, opacity: 0.18 },
];

function CameraIcon() {
  return (
    <svg width="136" height="136" viewBox="0 0 136 136" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="67.9996" cy="67.9997" r="57.7857" stroke="#1A1B1C"/>
      <circle cx="68" cy="68" r="51" fill="#1A1B1C"/>
      <path d="M100.668 35.412C92.3149 27.0382 80.7627 21.8569 68.0003 21.8569C65.0469 21.8569 62.1583 22.1344 59.3592 22.6647C64.1338 30.5633 81.5795 58.2549 84.9406 63.1803C85.5932 64.1371 86.753 62.2365 93.7783 48.6929L100.668 35.412Z" fill="#FCFCFC"/>
      <path d="M25.0882 51.004C30.5815 37.1459 42.5936 26.5816 57.3413 23.0942C59.0872 25.713 62.4221 30.8872 66.0668 36.6493L75.3267 51.2908H48.8858C36.1263 51.2908 28.6691 51.2077 25.0882 51.004Z" fill="#FCFCFC"/>
      <path d="M31.8694 96.7032C25.602 88.8246 21.8574 78.8495 21.8574 67.9998C21.8574 62.801 22.7172 57.803 24.3023 53.1402H39.1666C56.552 53.1402 56.9478 53.1674 56.3267 54.3294C55.0953 56.6338 36.8239 88.2621 31.8694 96.7032Z" fill="#FCFCFC"/>
      <path d="M76.9643 113.273C74.0646 113.843 71.0674 114.143 68.0003 114.143C54.1917 114.143 41.7998 108.077 33.3436 98.465C35.1707 94.4055 39.9295 85.9319 48.1717 72.0115C48.9468 70.7014 49.7323 69.781 49.917 69.966C50.1016 70.1503 56.6037 80.5196 64.3671 93.0077L76.9643 113.273Z" fill="#FCFCFC"/>
      <path d="M111.529 83.348C106.372 97.9733 94.0533 109.22 78.7841 112.876C74.5785 106.389 60.6125 83.9565 60.6125 83.6094C60.6125 83.4658 72.6814 83.348 87.4326 83.348H111.529Z" fill="#FCFCFC"/>
      <path d="M101.902 36.6966C109.5 44.922 114.143 55.9187 114.143 67.9998C114.143 72.923 113.372 77.6662 111.944 82.115H96.5965C86.6243 82.115 78.4651 81.9646 78.4651 81.7803C78.4651 81.3997 98.4368 43.0157 101.902 36.6966Z" fill="#FCFCFC"/>
    </svg>
  );
}

function GalleryIcon() {
  return (
    <svg width="136" height="136" viewBox="0 0 136 136" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="67.9996" cy="67.9997" r="57.7857" stroke="#1A1B1C"/>
      <circle cx="68" cy="68" r="50" fill="#FCFCFC" stroke="#1A1B1C" strokeWidth="2"/>
      <path d="M78.3214 68C85.3631 68 91.0714 62.2916 91.0714 55.25C91.0714 48.2084 85.3631 42.5 78.3214 42.5C71.2798 42.5 65.5714 48.2084 65.5714 55.25C65.5714 62.2916 71.2798 68 78.3214 68Z" fill="#1A1B1C"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M17 68C17 71.9604 17.4514 75.8154 18.3056 79.5163C23.5265 102.136 43.7939 119 68 119C94.8673 119 116.882 98.2244 118.856 71.862C118.951 70.5872 119 69.2993 119 68C119 39.8335 96.1665 17 68 17C39.8335 17 17 39.8335 17 68ZM35.3365 67.7257L19.3825 78.7708C18.6175 75.3024 18.2143 71.6983 18.2143 68C18.2143 40.5041 40.5041 18.2143 68 18.2143C95.4959 18.2143 117.786 40.5041 117.786 68C117.786 69.5412 117.716 71.0661 117.579 72.5716L82.9447 91.8127C80.4324 93.2084 77.3343 92.9968 75.0351 91.2724L43.855 67.8874C41.3462 66.0058 37.9149 65.9406 35.3365 67.7257Z" fill="#1A1B1C"/>
    </svg>
  );
}

const LOADING_DIAMONDS = [
  { size: 220, duration: 18, delay:    0, opacity: 0.55 },
  { size: 260, duration: 25, delay: -7.8, opacity: 0.28 },
  { size: 300, duration: 35, delay:  -20, opacity: 0.18 },
];

export default function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  const [cameraModal, setCameraModal] = useState(false);
  const [cameraModalExiting, setCameraModalExiting] = useState(false);
  const [previewImage, setPreviewImage] = useState(location.state?.capturedImage ?? null);
  const [previewMirrored, setPreviewMirrored] = useState(!!location.state?.capturedImage);
  const [isLoading, setIsLoading] = useState(!!location.state?.capturedImage);
  const [, setDemographics] = useState(null);
  const fileInputRef = useRef(null);

  function handleGalleryClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreviewImage(ev.target.result);
      setPreviewMirrored(false);
      setIsLoading(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function closeModal() {
    setCameraModalExiting(true);
    setTimeout(() => {
      setCameraModal(false);
      setCameraModalExiting(false);
    }, 250);
  }

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!isLoading || !previewImage) return;
    async function analyze() {
      let data = null;
      try {
        const base64 = previewImage.split(",")[1];
        const res = await fetch(
          "https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseTwo",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64 }),
          }
        );
        data = await res.json();
        setDemographics(data);
      } catch (err) {
        console.error("skinstricPhaseTwo error:", err);
      }
      navigate("/select", { state: { demographics: data }, replace: true });
    }
    analyze();
  }, [isLoading, previewImage]);

  if (isLoading) {
    return (
      <div className={`result ${mounted ? "result--mounted" : ""}`}>
        <nav className="result__nav">
          <div className="result__nav-left">
            <span className="result__logo">SKINSTRIC</span>
            <svg width="4" height="17" viewBox="0 0 4 17" fill="none" aria-hidden="true">
              <line x1="1" y1="0" x2="1" y2="17" stroke="#1a1b1c" strokeWidth="1"/>
              <line x1="1" y1="0" x2="4" y2="0" stroke="#1a1b1c" strokeWidth="1"/>
              <line x1="1" y1="17" x2="4" y2="17" stroke="#1a1b1c" strokeWidth="1"/>
            </svg>
            <span className="result__nav-label">INTRO</span>
            <svg width="4" height="17" viewBox="0 0 4 17" fill="none" aria-hidden="true">
              <line x1="3" y1="0" x2="3" y2="17" stroke="#1a1b1c" strokeWidth="1"/>
              <line x1="3" y1="0" x2="0" y2="0" stroke="#1a1b1c" strokeWidth="1"/>
              <line x1="3" y1="17" x2="0" y2="17" stroke="#1a1b1c" strokeWidth="1"/>
            </svg>
          </div>
          <button className="result__enter-code">ENTER CODE</button>
        </nav>

        <div className="result__loading-diamonds" aria-hidden="true">
          {LOADING_DIAMONDS.map((d, i) => (
            <div
              key={i}
              className="result__loading-diamond"
              style={{
                width:      d.size,
                height:     d.size,
                marginTop:  -(d.size / 2),
                marginLeft: -(d.size / 2),
                opacity:    d.opacity,
                animation:  `resultRotateCW ${d.duration}s linear ${d.delay}s infinite`,
              }}
            />
          ))}
        </div>
        <div className="result__loading-center">
          <p className="result__loading-text">
            Preparing your Analysis
            <span className="result__loading-dots">
              <span className="result__loading-dot" style={{ animationDelay: "0s" }}>.</span>
              <span className="result__loading-dot" style={{ animationDelay: "0.2s" }}>.</span>
              <span className="result__loading-dot" style={{ animationDelay: "0.4s" }}>.</span>
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`result ${mounted ? "result--mounted" : ""}`}>

      {/* Nav */}
      <nav className="result__nav">
        <div className="result__nav-left">
          <span className="result__logo">SKINSTRIC</span>
          <svg width="4" height="17" viewBox="0 0 4 17" fill="none" aria-hidden="true">
            <line x1="1" y1="0" x2="1" y2="17" stroke="#1a1b1c" strokeWidth="1"/>
            <line x1="1" y1="0" x2="4" y2="0" stroke="#1a1b1c" strokeWidth="1"/>
            <line x1="1" y1="17" x2="4" y2="17" stroke="#1a1b1c" strokeWidth="1"/>
          </svg>
          <span className="result__nav-label">INTRO</span>
          <svg width="4" height="17" viewBox="0 0 4 17" fill="none" aria-hidden="true">
            <line x1="3" y1="0" x2="3" y2="17" stroke="#1a1b1c" strokeWidth="1"/>
            <line x1="3" y1="0" x2="0" y2="0" stroke="#1a1b1c" strokeWidth="1"/>
            <line x1="3" y1="17" x2="0" y2="17" stroke="#1a1b1c" strokeWidth="1"/>
          </svg>
        </div>
        <button className="result__enter-code">ENTER CODE</button>
      </nav>

      {/* Preview box */}
      <div className="result__preview">
        <span className="result__preview-label">Preview</span>
        <div className="result__preview-box">
          {previewImage && (
            <img
              src={previewImage}
              alt="Face preview"
              className="result__preview-img"
              style={previewMirrored ? { transform: "scaleX(-1)" } : undefined}
            />
          )}
        </div>
      </div>

      {/* Subtitle */}
      <p className="result__subtitle">TO START ANALYSIS</p>

      {/* Left group — camera */}
      <div className="result__group result__group--left">
        <div className="result__diamonds" aria-hidden="true">
          {DIAMONDS.map((d, i) => (
            <div
              key={i}
              className="result__diamond"
              style={{
                width:      d.size,
                height:     d.size,
                marginTop:  -(d.size / 2),
                marginLeft: -(d.size / 2),
                opacity:    d.opacity,
                animation:  `resultRotateCW ${d.duration}s linear ${d.delay}s infinite`,
              }}
            />
          ))}
        </div>
        <button className="result__icon-btn" onClick={() => setCameraModal(true)}>
          <CameraIcon />
        </button>
        {/* Label with line */}
        <div className="result__label result__label--camera">
          <svg className="result__label-line" width="50" height="50" viewBox="0 0 50 50" fill="none">
            <line x1="0" y1="50" x2="50" y2="0" stroke="#1a1b1c" strokeWidth="0.8"/>
          </svg>
          <span>ALLOW A.I.<br />TO SCAN YOUR FACE</span>
        </div>
      </div>

      {/* Right group — gallery */}
      <div className="result__group result__group--right">
        <div className="result__diamonds" aria-hidden="true">
          {DIAMONDS.map((d, i) => (
            <div
              key={i}
              className="result__diamond"
              style={{
                width:      d.size,
                height:     d.size,
                marginTop:  -(d.size / 2),
                marginLeft: -(d.size / 2),
                opacity:    d.opacity,
                animation:  `resultRotateCW ${d.duration}s linear ${d.delay}s infinite`,
              }}
            />
          ))}
        </div>
        <button className="result__icon-btn" onClick={handleGalleryClick}>
          <GalleryIcon />
        </button>
        {/* Label with line */}
        <div className="result__label result__label--gallery">
          <svg className="result__label-line" width="50" height="50" viewBox="0 0 50 50" fill="none">
            <line x1="50" y1="0" x2="0" y2="50" stroke="#1a1b1c" strokeWidth="0.8"/>
          </svg>
          <span>ALLOW A.I.<br />ACCESS GALLERY</span>
        </div>
      </div>

      {/* Camera permission modal */}
      {cameraModal && (
        <div className={`result__modal ${cameraModalExiting ? "result__modal--exit" : "result__modal--enter"}`}>
          <p className="result__modal-title">ALLOW A.I. TO ACCESS YOUR CAMERA</p>
          <div className="result__modal-actions">
            <button className="result__modal-btn result__modal-btn--deny" onClick={closeModal}>DENY</button>
            <button className="result__modal-btn result__modal-btn--allow" onClick={() => { closeModal(); setTimeout(() => navigate("/camera"), 250); }}>ALLOW</button>
          </div>
        </div>
      )}

      {/* Hidden file input for gallery */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Back */}
      <button className="result__back" onClick={() => navigate("/testing")}>
        <div className="result__back-diamond">
          <span className="result__back-arrow">&#9664;</span>
        </div>
        <span className="result__back-label">BACK</span>
      </button>

    </div>
  );
}
