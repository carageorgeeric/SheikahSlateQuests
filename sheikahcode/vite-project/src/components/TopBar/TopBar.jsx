import styles from "./TopBar.module.css";

export default function TopBar({ title }) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
    </header>
  );
}
