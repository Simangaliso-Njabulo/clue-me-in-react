import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { GameProvider } from './context/GameContext';
import { SoundProvider } from './context/SoundContext';
import { HomePage } from './pages/HomePage';
import { PlayPage } from './pages/PlayPage';
import { ResultsPage } from './pages/ResultsPage';
import { StatsPage } from './pages/StatsPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { SplashScreen } from './components/SplashScreen';
import { ParticleBackground } from './components/ui/ParticleBackground';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/play" element={<PlayPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash for 2.5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <GameProvider>
        <SoundProvider>
          <ParticleBackground particleCount={40} />
          <SplashScreen isVisible={showSplash} />
          <AnimatedRoutes />
        </SoundProvider>
      </GameProvider>
    </BrowserRouter>
  );
}

export default App;
