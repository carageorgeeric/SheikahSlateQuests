import { useState } from "react";
import QuestCard from "../QuestCard/QuestCard";
import CreateQuestModal from "../CreateQuestModal/CreateQuestModal";
import QuestDetailModal from "../QuestDetailModal/QuestDetailModal";
import { useQuests } from "../../context/QuestContext";
import styles from "./HomeScreen.module.css";

export default function HomeScreen() {
  const { quests } = useQuests();

  const [filter, setFilter] = useState("all"); // 'all' | 'main' | 'side'

  const activeQuests = quests.filter((q) => q.photo === null);

  const questsToShow =
    filter === "all" ? activeQuests : quests.filter((q) => q.type === filter);

  const [selectedQuest, setSelectedQuest] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <div>
      <div className={styles.buttons}>
        <button className={styles.Btn} onClick={() => setModalAberto(true)}>
          Criar uma quest
        </button>
        <button className={styles.Btn} onClick={() => setFilter("main")}>
          Main Quests
        </button>
        <button className={styles.Btn} onClick={() => setFilter("side")}>
          Side Quests
        </button>
        <button className={styles.Btn} onClick={() => setFilter("all")}>
          Todas
        </button>
      </div>

      {questsToShow.map((quest) => (
        <QuestCard
          key={quest.id}
          quest={quest}
          onClick={() => setSelectedQuest(quest)}
        />
      ))}
      {modalAberto && (
        <CreateQuestModal onClose={() => setModalAberto(false)} />
      )}
      {selectedQuest && (
        <QuestDetailModal
          quest={selectedQuest}
          onClose={() => setSelectedQuest(null)}
        />
      )}
    </div>
  );
}
