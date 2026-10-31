import Head from "next/head";
import { useEffect, useState } from "react";
import { Moon, Sun } from "react-feather";
import Piano from "../components/Piano";
import { compliments } from "../data/compliments";

export default function Home() {
  const [dark, setDark] = useState(true);
  const [compliment, setCompliment] = useState("");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    if (savedTheme) {
      setDark(savedTheme === "dark");
    }
    setCompliment(compliments[Math.floor(Math.random() * compliments.length)]);
  }, []);

  const getRandomCompliment = () => {
    setCompliment(compliments[Math.floor(Math.random() * compliments.length)]);
  };

  if (compliment.length === 0) {
    return (
      <div className={`container ${dark ? "dark" : ""}`}>
        <p>Загружаю уют...</p>
      </div>
    );
  }

  return (
    <div className={`container ${dark ? "dark" : ""}`}>
      <Head>
        <title>Для моей любимой 🧶</title>
        <link rel="icon" href="/ur-a-cutie/favicon.ico" />
      </Head>

      <main className="main">
        <h1 className="title">Привет, любовь! 🥧</h1>
        <p className="description">Надеюсь, твой день такой же прекрасный, как ты.</p>
        
        <div className="toggle-container">
          {dark ? (
            <Sun
              onClick={() => {
                window.localStorage.setItem("theme", "light");
                setDark(false);
              }}
              style={{ cursor: "pointer" }}
            />
          ) : (
            <Moon
              onClick={() => {
                window.localStorage.setItem("theme", "dark");
                setDark(true);
              }}
              style={{ cursor: "pointer" }}
            />
          )}
        </div>

        <div 
          className="yarn-button" 
          onClick={getRandomCompliment}
          title="Нажми, чтобы получить новый комплимент"
        >
          🧶 {compliment}
        </div>

        <Piano dark={dark} />
      </main>

      <style jsx>{`
        .dark {
          background: #1a1a1a;
          color: #f0f0f0;
        }
        .container {
          min-height: 100vh;
          padding: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          transition: background 0.3s, color 0.3s;
          border: none;
          margin: 0;
          width: 100%;
        }
        .main {
          padding: 2rem 1rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          max-width: 800px;
        }
        .toggle-container {
          margin: 1.5rem 0;
        }
        .yarn-button {
          background: ${dark ? "#2d2d2d" : "#fff0f5"};
          border: 2px solid ${dark ? "#ED64A6" : "#F687B3"};
          color: ${dark ? "#f0f0f0" : "#333"};
          padding: 1rem 1.5rem;
          border-radius: 50px;
          font-size: 1.2rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          max-width: 600px;
          box-shadow: 0 4px 15px rgba(237, 100, 166, 0.2);
          margin: 2rem 0;
        }
        .yarn-button:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 6px 20px rgba(237, 100, 166, 0.4);
          background: ${dark ? "#ED64A6" : "#F687B3"};
          color: white;
        }
        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 3rem;
          text-align: center;
        }
        .description {
          line-height: 1.5;
          font-size: 1.2rem;
          text-align: center;
          opacity: 0.8;
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
}