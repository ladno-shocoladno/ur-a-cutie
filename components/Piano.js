import { useState, useEffect } from "react";

const notes = [
  { key: "a", note: "До", freq: 261.63, color: "white" },
  { key: "w", note: "До#", freq: 277.18, color: "black" },
  { key: "s", note: "Ре", freq: 293.66, color: "white" },
  { key: "e", note: "Ре#", freq: 311.13, color: "black" },
  { key: "d", note: "Ми", freq: 329.63, color: "white" },
  { key: "f", note: "Фа", freq: 349.23, color: "white" },
  { key: "t", note: "Фа#", freq: 369.99, color: "black" },
  { key: "g", note: "Соль", freq: 392.00, color: "white" },
  { key: "y", note: "Соль#", freq: 415.30, color: "black" },
  { key: "h", note: "Ля", freq: 440.00, color: "white" },
  { key: "u", note: "Ля#", freq: 466.16, color: "black" },
  { key: "j", note: "Си", freq: 493.88, color: "white" },
  { key: "k", note: "До2", freq: 523.25, color: "white" },
];

export default function Piano({ dark }) {
  const [activeKey, setActiveKey] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const playNote = (freq) => {
    const audio = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audio.createOscillator();
    const gainNode = audio.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audio.destination);

    oscillator.frequency.value = freq;
    oscillator.type = "triangle";
    gainNode.gain.setValueAtTime(0.3, audio.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + 1.5);

    oscillator.start(audio.currentTime);
    oscillator.stop(audio.currentTime + 1.5);
  };

  const triggerNote = (keyData) => {
    setActiveKey(keyData.note);
    playNote(keyData.freq);
    setTimeout(() => setActiveKey((prev) => (prev === keyData.note ? null : prev)), 200);
  };

  useEffect(() => {
    if (isMobile) return;

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      const noteData = notes.find((n) => n.key === key);
      if (noteData && !e.repeat) {
        e.preventDefault();
        triggerNote(noteData);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobile]);

  // На мобильных показываем только 7 белых клавиш (без чёрных)
  const displayNotes = isMobile ? notes.filter((n) => n.color === "white").slice(0, 7) : notes;

  return (
    <div className="piano-container">
      <h3 className="piano-title">🎹 Сыграй мне мелодию</h3>
      
      <div className={`piano-wrapper ${isMobile ? "mobile" : ""}`}>
        <div className={`piano ${isMobile ? "mobile" : ""}`}>
          {displayNotes.map((keyData) => (
            <button
              key={keyData.note}
              className={`key ${keyData.color} ${activeKey === keyData.note ? "active" : ""}`}
              onMouseDown={() => triggerNote(keyData)}
              onTouchStart={(e) => {
                e.preventDefault();
                triggerNote(keyData);
              }}
            >
              <span className="key-label">{keyData.note}</span>
              {!isMobile && <span className="key-hint">{keyData.key.toUpperCase()}</span>}
            </button>
          ))}
        </div>
        {isMobile && <div className="scroll-hint">←  →</div>}
      </div>

      <style jsx>{`
        .piano-container {
          text-align: center;
          margin: 2rem 0;
          padding: 1.5rem;
          border-radius: 15px;
          background: ${dark ? "#2d2d44" : "#f8f9fa"};
          width: 100%;
          max-width: 90vw;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .piano-title {
          margin: 0 0 0.5rem 0;
          font-size: 1.4rem;
          color: ${dark ? "#fff" : "#333"};
        }

        .piano-hint {
          margin: 0 0 1.5rem 0;
          font-size: 0.9rem;
          color: ${dark ? "#aaa" : "#666"};
        }

        .piano-wrapper {
          position: relative;
          width: 100%;
        }

        .piano-wrapper.mobile {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding-bottom: 5px;
        }

        .piano-wrapper.mobile::-webkit-scrollbar {
          display: none;
        }

        .scroll-hint {
          margin-top: 10px;
          font-size: 0.8rem;
          color: ${dark ? "#888" : "#999"};
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .piano {
          display: flex;
          justify-content: center;
          position: relative;
          height: 200px;
          min-width: min-content;
          user-select: none;
        }

        .piano.mobile {
          height: 180px;
          justify-content: flex-start;
          padding: 0 10px;
        }

        .key {
          position: relative;
          border: 1px solid #333;
          border-radius: 0 0 6px 6px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          padding-bottom: 10px;
          transition: all 0.1s ease;
          flex-shrink: 0;
          outline: none;
        }

        .key.white {
          width: ${isMobile ? "50px" : "55px"};
          height: ${isMobile ? "180px" : "200px"};
          background: linear-gradient(to bottom, #fff 0%, #eee 100%);
          color: #333;
          z-index: 1;
        }

        .key.black {
          width: 36px;
          height: 120px;
          background: linear-gradient(to bottom, #333 0%, #000 100%);
          color: #fff;
          margin-left: -18px;
          margin-right: -18px;
          z-index: 2;
          border-color: #000;
        }

        .key.active {
          transform: translateY(3px);
          background: ${dark ? "linear-gradient(to bottom, #ED64A6 0%, #D53F8C 100%)" : "linear-gradient(to bottom, #F687B3 0%, #ED64A6 100%)"};
          color: #fff;
          border-color: #D53F8C;
        }

        .key-label {
          font-size: ${isMobile ? "0.85rem" : "0.95rem"};
          font-weight: bold;
        }

        .key-hint {
          font-size: 0.75rem;
          opacity: 0.6;
          margin-top: 6px;
          font-family: monospace;
        }

        @media (max-width: 480px) {
          .piano-container {
            padding: 1rem;
          }
          .piano-title {
            font-size: 1.2rem;
          }
          .key.white {
            width: 45px;
            height: 160px;
          }
        }
      `}</style>
    </div>
  );
}