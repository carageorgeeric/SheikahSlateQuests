import { useState } from "react";

export default function HomeScreen() {
  const mockQuests = [
    {
      id: "1",
      title: 'Terminar o Livro "Oh Shift" ',
      type: "main",
      description:
        'Terminar o livro "Oh Shift" e fazer um resumo no caderno designado para isso ',
      photo: null,
    },
    {
      id: "2",
      title: "Cozinhar o frango",
      type: "side",
      description:
        "Preparar o frango para o jantar de hoje, seguindo a receita do livro de culinária",
      photo: null,
    },

    {
      id: "3",
      title: "Limpar a casa",
      type: "side",
      description: "Limpar a casa e organizar os cômodos",
      photo: "foto-existe",
    },
  ];

  const [filter, setFilter] = useState("all"); // 'all' | 'main' | 'side'

  const questsToShow =
    filter === "all" ? mockQuests : mockQuests.filter((q) => q.type === filter);

  return (
    <div>
      <div>Home Screen</div>
      <button onClick={() => setFilter("all")}> Todas </button>
      <button onClick={() => setFilter("main")}> Main Quests </button>
      <button onClick={() => setFilter("side")}> Side Quests </button>

      {questsToShow.map((quest) => (
        <QuestCard key={quest.id} quest={quest} />
      ))}
    </div>
  );
}
