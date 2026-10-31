import { useState, useEffect } from "react";

const keys = [
  { note: "До", freq: 261.63, type: "white" },
  { note: "Ре", freq: 293.66, type: "white" },
  { note: "Ми", freq: 329.63, type: "white" },
  { note: "Фа", freq: 349.23, type: "white" },
  { note: "Соль", freq: 392.00, type: "white" },
  { note: "Ля", freq: 440.00, type: "white" },
  { note: "Си", freq: 493.88, type: "white" },
];

export default function Piano({ dark }) {
  const [audioCtx, setAudioCtx] = useState(null);

  useEffect(() => {
    // Инициализируем аудио контекст при первом рендере
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    setAudioCtx(ctx);
  }, []);

  const playNote = (freq) => {
    if (!audioCtx) return;
    if (audioCtx.state === "suspended") audioCtx.resume();

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = "sine"; // Мягкий звук, похожий на пианино/флейту
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    // Плавное затухание звука
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1.5);
  };

  return (
    <div className="piano-container">
      <p className="piano-text">Нажми на клавиши, чтобы сыграть мелодию для меня 🎹</p>
      <div className="piano">
        {keys.map((key, index) => (
          <button
            key={index}
            className={`key ${key.type} ${dark ? "dark-key" : ""}`}
            onClick={() => playNote(key.freq)}
          >
            <span className="note-name">{key.note}</span>
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
          width: 40px;
          height: 120px;
          background: white;
          border: 1px solid #ccc;
          border-radius: 0 0 5px 5px;
          margin: 0 2px;
          cursor: pointer;
          position: relative;
          transition: background 0.1s, transform 0.1s;
        }
        .key:active, .key.active {
          background: #eee;
          transform: translateY(2px);
        }
        .dark-key:active, .dark-key.active {
          background: #555;
        }
        .note-name {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 12px;
          color: #888;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}