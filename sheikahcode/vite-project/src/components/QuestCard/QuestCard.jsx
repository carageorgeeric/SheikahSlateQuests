import styles from "./QuestCard.module.css";

export default function QuestCard({ quest, onClick }) {
  const rupees = quest.type === "main" ? 100 : 20;

  const isCompleted = quest.photo !== null;

  return (
    <div className={styles.questCard} onClick={onClick}>
      <span className={styles.questTitle}>{quest.title}</span>
      <span className={styles.questType}>
        {quest.type === "main" ? "Main Quest" : "Side Quest"}
      </span>
      {isCompleted && <span> Quest Completa! </span>}
    </div>
  );
}
