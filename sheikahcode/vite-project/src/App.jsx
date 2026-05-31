import { useState } from "react";
import { QuestProvider } from "./context/QuestContext";
import SplashScreen from "./components/SplashScreen/SplashScreen";
import HomeScreen from "./components/HomeScreen/HomeScreen";
import TopBar from "./components/TopBar/TopBar";
import BottomNav from "./components/BottomNav/BottomNav";
import GalleryScreen from "./components/GalleryScreen/GalleryScreen";
import Layout from "./components/layout/Layout";

function App() {
  const titles = {
    home: "Sheikah Slate",
    gallery: "Galeria",
  };
  const [currentScreen, setCurrentScreen] = useState("splash");

  return (
    <QuestProvider>
      <Layout>
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
      </Layout>
    </QuestProvider>
  );
}

export default App;
