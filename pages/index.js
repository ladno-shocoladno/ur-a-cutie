import Head from "next/head";
import { useEffect, useState } from "react";
import { Moon, Sun } from "react-feather";
import Weather from "../components/weather/Weather";
import Preloader from "../components/Preloader";
import LinkGrid from "../components/links/LinkGrid";
import Footer from "../components/Footer";
import { compliments } from "../data/compliments";

export default function Home() {
  const [dark, setDark] = useState(true);
  const [days, setDays] = useState([undefined, undefined, undefined, undefined, undefined]);
  const [compliment, setCompliment] = useState("");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    if (savedTheme) {
      setDark(savedTheme === "dark");
    }

    const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
    setCompliment(randomCompliment);

    fetch("https://wttr.in/?format=j1")
      .then((res) => res.json())
      .then((data) => {
        const forecast = data.weather || [];
        const weatherDays = forecast.slice(0, 5).map((day) => ({
          date: day.date,
          maxTemp: day.maxtempC,
          minTemp: day.mintempC,
          // можно добавить иконку погоды
        }));
        setDays(weatherDays);
      })
      .catch(() => {
        setDays([]);
      });
  }, []);

  if (compliment.length === 0) {
    return <Preloader dark={dark} />;
  }

  return (
    <div className={`container ${dark ? "dark" : ""}`}>
      <Head>
        <title>Hey Madin</title>
        <link rel="icon" href="/ur-a-cutie/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">Hi, Madin 🥧!</h1>

        <p className="description">Hope you're having a great day!</p>
        <div className="toggle-container">
          {dark ? (
            <Sun
              onClick={() => {
                window.localStorage.setItem("theme", "light");
                setDark(false);
              }}
            />
          ) : (
            <Moon
              onClick={() => {
                window.localStorage.setItem("theme", "dark");
                setDark(true);
              }}
            />
          )}
        </div>
        <code
          className={`${dark ? "dark-code" : ""} compliment`}
          onClick={() => {
            const newCompliment = compliments[Math.floor(Math.random() * compliments.length)];
            setCompliment(newCompliment);
          }}
        >
          Always Remember: {compliment}
        </code>

        {days.length > 0 && <Weather days={days} dark={dark} />}
        <LinkGrid dark={dark} />
      </main>
      <Footer dark={dark} />
      <style jsx>{`
        .dark {
          background: #212121;
          color: white;
        }

        .dark-code {
          color: black;
        }

        code:hover,
        code:active,
        code:focus {
          color: #f687b3;
          border-color: #f687b3;
        }

        .dark-code:hover,
        .dark-code:active,
        .dark-code:focus {
          background: #ed64a6;
          border-color: #ed64a6;
          color: black;
        }

        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .compliment {
          cursor: pointer;
        }

        .toggle-container {
          padding-bottom: 25px;
        }

        main {
          padding: 2.5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .logo {
          height: 1em;
        }
      `}</style>
      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}