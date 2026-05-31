import { useState } from "react";
import { useQuests } from "../../context/QuestContext";

export default function GalleryScreen() {
  const { quests } = useQuests();
  const [filter, setFilter] = useState("all");

  const completedQuests = quests.filter((q) => q.photo !== null);

  const filtered =
    filter === "all"
      ? completedQuests
      : completedQuests.filter((q) => q.type === filter);

  const sorted = [...filtered].sort((a, b) => {
    if (a.photo && !b.photo) return -1;
    if (!a.photo && b.photo) return 1;
    return 0;
  });

  return (
    <div>
      {sorted.map((quest) => (
        <div key={quest.id}>
          {quest.photo && <img src={quest.photo} alt={quest.title} />}
          <p>{quest.title}</p>
        </div>
      ))}
    </div>
  );
}
