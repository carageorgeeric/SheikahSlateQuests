import { createContext, useState, useContext } from "react";

const QuestContext = createContext();

export function QuestProvider({ children }) {
  const [quests, setQuests] = useState([]);

  function addQuest(quest) {
    const newQuests = {
      id: crypto.randomUUID(),
      ...quest,
      photo: null,
    };
    setQuests((prev) => [...prev, newQuests]);
  }

  function updateQuest(id, changes) {
    setQuests((prev) =>
      prev.map((quest) => (quest.id === id ? { ...quest, ...changes } : quest)),
    );
  }

  function completeQuest(id, photo) {
    updateQuest(id, { photo });
  }

  function deleteQuest(id) {
    setQuests((prev) => prev.filter((quest) => quest.id !== id));
  }

  const value = {
    quests,
    addQuest,
    updateQuest,
    completeQuest,
    deleteQuest,
  };

  return (
    <QuestContext.Provider value={value}>{children}</QuestContext.Provider>
  );
}

export function useQuests() {
  return useContext(QuestContext);
}
