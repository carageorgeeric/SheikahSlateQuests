import styles from "./TopBar.module.css";

export default function TopBar({ title }) {
  return (
    <header>
      <h1>{title}</h1>
    </header>
  );
}
