import { useState } from "react";
import { QuestProvider } from "./context/QuestContext";
import SplashScreen from "./components/SplashScreen/SplashScreen";
import HomeScreen from "./components/HomeScreen/HomeScreen";
import TopBar from "./components/TopBar/TopBar";
import BottomNav from "./components/BottomNav/BottomNav";
import GalleryScreen from "./components/GalleryScreen/GalleryScreen";

function App() {
  const titles = {
    home: "Sheikah Slate",
    gallery: "Galeria",
  };
  const [currentScreen, setCurrentScreen] = useState("splash");

  return (
    <QuestProvider>
      {currentScreen === "splash" ? (
        <SplashScreen onFinish={() => setCurrentScreen("home")} />
      ) : (
        <>
          <TopBar title={titles[currentScreen]} />
          {currentScreen === "home" ? <HomeScreen /> : <GalleryScreen />}
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={setCurrentScreen}
          />
        </>
      )}
    </QuestProvider>
  );
}

export default App;
