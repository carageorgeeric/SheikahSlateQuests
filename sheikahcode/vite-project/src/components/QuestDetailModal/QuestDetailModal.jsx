import { useState } from "react";
import { useQuests } from "../../context/QuestContext";
import styles from "../QuestDetailModal/QuestDetailModal.module.css";

export default function QuestDetailModal({ quest, onClose }) {
  const { updateQuest, completeQuest } = useQuests();
  const [description, setDescription] = useState(quest.description);

  function handleSave() {
    updateQuest(quest.id, {
      description,
    });
  }

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      completeQuest(quest.id, reader.result);
      onClose();
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className={styles.overlay2}>
      <div className={styles.detail}>
        <h2>{quest.title}</h2>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleSave}>Salvar Descrição</button>

        <button onClick={onClose}> Fechar </button>

        {!quest.photo && (
          <label className={styles.concluir}>
            Concluir Quest{" "}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhoto}
              style={{ display: "none" }}
            />
          </label>
        )}
      </div>
    </div>
  );
}
