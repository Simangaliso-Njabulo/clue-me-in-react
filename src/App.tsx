import { useState, useEffect, Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
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

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App Error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ color: 'white', padding: '2rem', fontFamily: 'monospace' }}>
          <h1 style={{ color: '#f472b6' }}>Something went wrong</h1>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
            {this.state.error.message}
          </pre>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: '0.5rem', fontSize: '0.75rem', opacity: 0.7 }}>
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

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
    <ErrorBoundary>
      <HashRouter>
        <GameProvider>
          <SoundProvider>
            <ParticleBackground particleCount={40} />
            <SplashScreen isVisible={showSplash} />
            <AnimatedRoutes />
          </SoundProvider>
        </GameProvider>
      </HashRouter>
    </ErrorBoundary>
  );
}

export default App;
