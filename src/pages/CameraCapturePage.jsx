import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./pages.css";

export default function CameraCapturePage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [captured, setCaptured] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        setCameraError("Camera access denied or unavailable.");
      }
    }
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  function handleCapture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/png");
    setCaptured(dataUrl);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
  }

  function handleRetake() {
    setCaptured(null);
    async function restart() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        setCameraError("Camera access denied or unavailable.");
      }
    }
    restart();
  }

  function handleUsePhoto() {
    navigate("/result", { state: { capturedImage: captured } });
  }

  return (
    <div className={`capture ${mounted ? "capture--mounted" : ""}`}>

      {/* Full-screen video / preview */}
      {cameraError ? (
        <div className="capture__error-screen">
          <p className="capture__error">{cameraError}</p>
        </div>
      ) : captured ? (
        <img src={captured} alt="Captured face" className="capture__fullscreen" />
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="capture__fullscreen"
        />
      )}

      {/* Nav — sits on top */}
      <nav className="capture__nav">
        <div className="capture__nav-left">
          <span className="capture__logo">SKINSTRIC</span>
          <svg width="4" height="17" viewBox="0 0 4 17" fill="none" aria-hidden="true">
            <line x1="1" y1="0" x2="1" y2="17" stroke="#1a1b1c" strokeWidth="1"/>
            <line x1="1" y1="0" x2="4" y2="0" stroke="#1a1b1c" strokeWidth="1"/>
            <line x1="1" y1="17" x2="4" y2="17" stroke="#1a1b1c" strokeWidth="1"/>
          </svg>
          <span className="capture__nav-label">INTRO</span>
          <svg width="4" height="17" viewBox="0 0 4 17" fill="none" aria-hidden="true">
            <line x1="3" y1="0" x2="3" y2="17" stroke="#1a1b1c" strokeWidth="1"/>
            <line x1="3" y1="0" x2="0" y2="0" stroke="#1a1b1c" strokeWidth="1"/>
            <line x1="3" y1="17" x2="0" y2="17" stroke="#1a1b1c" strokeWidth="1"/>
          </svg>
        </div>
        <button className="capture__enter-code">ENTER CODE</button>
      </nav>

      {/* "great shot!" label — only when captured */}
      {captured && (
        <p className="capture__great-shot">great shot!</p>
      )}

      {/* Right-side shutter — only when not captured */}
      {!cameraError && !captured && (
        <div className="capture__right-action">
          <span className="capture__action-label">TAKE PICTURE</span>
          <button className="capture__shutter" onClick={handleCapture} aria-label="Take photo">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1a1b1c" strokeWidth="1.5">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </button>
        </div>
      )}

      {/* Bottom tips — only when not captured */}
      {!captured && (
        <div className="capture__bottom">
          <p className="capture__tips-title">TO GET BETTER RESULTS MAKE SURE TO HAVE</p>
          <div className="capture__tips-list">
            <span className="capture__tip"><span className="capture__tip-diamond">&#9671;</span> NEUTRAL EXPRESSION</span>
            <span className="capture__tip"><span className="capture__tip-diamond">&#9671;</span> FRONTAL POSE</span>
            <span className="capture__tip"><span className="capture__tip-diamond">&#9671;</span> ADEQUATE LIGHTING</span>
          </div>
        </div>
      )}

      {/* Bottom-left back — only when not captured */}
      {!captured && (
        <button
          className="capture__back-btn"
          onClick={() => navigate("/camera")}
          aria-label="Back"
        >
          <div className="capture__back-diamond">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <polygon points="5,0 10,5 5,10 0,5" fill="#1a1b1c"/>
            </svg>
          </div>
          <span className="capture__back-label">BACK</span>
        </button>
      )}

      {/* Retake / Use this photo — only when captured */}
      {captured && (
        <div className="capture__post-actions">
          <button className="capture__post-btn" onClick={handleRetake}>Retake</button>
          <button className="capture__post-btn capture__post-btn--primary" onClick={handleUsePhoto}>Use this photo</button>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
