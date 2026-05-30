export default function BottomNav({ currentScreen, onNavigate }) {
  return (
    <nav>
      <button
        onClick={() => onNavigate("home")}
        className={currentScreen === "home" ? "active" : ""}
      >
        Home
      </button>
      <button
        onClick={() => onNavigate("gallery")}
        className={currentScreen === "gallery" ? "active" : ""}
      >
        Gallery
      </button>
    </nav>
  );
}
