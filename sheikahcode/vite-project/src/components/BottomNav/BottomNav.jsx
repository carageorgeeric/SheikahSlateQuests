import styles from "./BottomNav.module.css";

export default function BottomNav({ currentScreen, onNavigate }) {
  return (
    <nav className={styles.nav}>
      <button
        className={`${styles.tab} ${currentScreen === "home" ? styles.active : ""}`}
        onClick={() => onNavigate("home")}
      >
        Home
      </button>
      <button
        className={`${styles.tab} ${currentScreen === "gallery" ? styles.active : ""}`}
        onClick={() => onNavigate("gallery")}
      >
        Gallery
      </button>
    </nav>
  );
}
