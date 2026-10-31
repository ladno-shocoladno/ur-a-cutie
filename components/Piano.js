import { useState, useEffect } from "react";

const keys = [
  { note: "До", freq: 261.63, type: "white", key: "1" },
  { note: "Ре", freq: 293.66, type: "white", key: "2" },
  { note: "Ми", freq: 329.63, type: "white", key: "3" },
  { note: "Фа", freq: 349.23, type: "white", key: "4" },
  { note: "Соль", freq: 392.00, type: "white", key: "5" },
  { note: "Ля", freq: 440.00, type: "white", key: "6" },
  { note: "Си", freq: 493.88, type: "white", key: "7" },
];

export default function Piano({ dark }) {
  const [audioCtx, setAudioCtx] = useState(null);
  const [activeKey, setActiveKey] = useState(null);

  useEffect(() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    setAudioCtx(ctx);
  }, []);

  const playNote = (freq, keyIndex) => {
    if (!audioCtx) return;
    if (audioCtx.state === "suspended") audioCtx.resume();

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1.5);

    // Визуальная обратная связь
    setActiveKey(keyIndex);
    setTimeout(() => setActiveKey(null), 200);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const keyIndex = keys.findIndex(k => k.key === e.key);
      if (keyIndex !== -1) {
        playNote(keys[keyIndex].freq, keyIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [audioCtx]);

  return (
    <div className="piano-container">
      <p className="piano-text">
        Нажми на клавиши или используй цифры <strong>1-7</strong> 🎹
      </p>
      <div className="piano">
        {keys.map((key, index) => (
          <button
            key={index}
            className={`key ${key.type} ${activeKey === index ? "active" : ""} ${dark ? "dark-key" : ""}`}
            onClick={() => playNote(key.freq, index)}
          >
            <span className="note-name">{key.note}</span>
            <span className="key-hint">{key.key}</span>
          </button>
        ))}
      </div>
      <style jsx>{`
        .piano-container {
          margin-top: 2rem;
          text-align: center;
        }
        .piano-text {
          font-size: 1rem;
          margin-bottom: 1rem;
          opacity: 0.8;
        }
        .piano {
          display: flex;
          justify-content: center;
          background: #333;
          padding: 10px 10px 0 10px;
          border-radius: 8px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.3);
        }
        .key {
          width: 50px;
          height: 140px;
          background: white;
          border: 1px solid #ccc;
          border-radius: 0 0 5px 5px;
          margin: 0 2px;
          cursor: pointer;
          position: relative;
          transition: background 0.1s, transform 0.1s;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          padding-bottom: 8px;
        }
        .key:active, .key.active {
          background: #f0f0f0;
          transform: translateY(2px);
          box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);
        }
        .dark-key:active, .dark-key.active {
          background: #555;
        }
        .note-name {
          font-size: 11px;
          color: #888;
          pointer-events: none;
          margin-bottom: 2px;
        }
        .key-hint {
          font-size: 10px;
          color: #aaa;
          font-weight: bold;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}