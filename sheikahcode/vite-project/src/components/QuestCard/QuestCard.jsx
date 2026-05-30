export default function QuestCard({ quest, onClick }) {
  const rupees = quest.type === "main" ? 100 : 20;

  const isCompleted = quest.photo !== null;

  return (
    <div onClick={onClick}>
      <span>{quest.title}</span>
      <span>{quest.type === "main" ? "Main Quest" : "Side Quest"}</span>
      <span>{rupees} Rupees</span>
      {isCompleted && <span> Quest Completa! </span>}
    </div>
  );
}
