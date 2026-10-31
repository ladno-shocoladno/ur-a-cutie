import LinkGridCard from "./LinkGridCard";

function SpecialLinks({ dark }) {
  const links = [
    {
      title: "🎵 Наш плейлист",
      description: "Мелодии, которые напоминают мне о тебе",
      link: "https://music.yandex.ru/", // ЗАМЕНИ НА ССЫЛКУ НА ВАШ ПЛЕЙЛИСТ
    },
    {
      title: "🧶 Вдохновение для вязания",
      description: "Красивые узоры и идеи для твоих шедевров",
      link: "https://www.pinterest.com/", // ЗАМЕНИ НА ССЫЛКУ НА PINTEREST
    },
    {
      title: "💌 Написать мне",
      description: "Я всегда жду сообщений от тебя",
      link: "https://t.me/ТВОЙ_НИК", // ЗАМЕНИ НА ССЫЛКУ НА ТЕЛЕГРАМ
    }
  ];

  return (
    <>
      <div className="grid">
        {links.map((link, idx) => (
          <LinkGridCard key={idx} title={link.title} description={link.description} link={link.link} dark={dark} />
        ))}
      </div>
      <style jsx>{`
        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 800px;
          margin-top: 3rem;
          gap: 1rem;
        }
        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}

export default SpecialLinks;