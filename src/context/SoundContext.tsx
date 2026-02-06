import { createContext, useContext, useCallback, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { audioService } from '../services/audioService';
import type { SoundEffect } from '../services/audioService';

interface AudioSettings {
  masterVolume: number;
  sfxVolume: number;
  enabled: boolean;
}

interface SoundContextValue {
  play: (sound: SoundEffect) => void;
  settings: AudioSettings;
  updateSettings: (settings: Partial<AudioSettings>) => void;
  toggleSound: () => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AudioSettings>(() => audioService.getSettings());

  // Sync settings changes to audioService
  useEffect(() => {
    audioService.saveSettings(settings);
  }, [settings]);

  const play = useCallback((sound: SoundEffect) => {
    audioService.play(sound);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AudioSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const toggleSound = useCallback(() => {
    setSettings(prev => ({ ...prev, enabled: !prev.enabled }));
  }, []);

  const value: SoundContextValue = {
    play,
    settings,
    updateSettings,
    toggleSound,
  };

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}

// Re-export SoundEffect type for convenience
export type { SoundEffect };
