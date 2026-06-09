import { useState } from "react";
import styles from "./CreateQuestModal.module.css";
import { useQuests } from "../../context/QuestContext";

export default function CreateQuestModal({ onClose }) {
  const { addQuest } = useQuests();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("main");
  const [description, setDescription] = useState("");

  function handleSubmit() {
    if (!title.trim()) return;

    addQuest({ title, type, description });
    onClose();
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nome da Quest"
        ></input>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Tipo da Quest"
        >
          <option value="main">Main</option>
          <option value="side">Side</option>
        </select>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Sobre sua Quest"
        ></textarea>
        <button onClick={handleSubmit}>Criar Quest</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}
