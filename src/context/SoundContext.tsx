import { createContext, useContext, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useGame } from './GameContext';

export type SoundName = 'correct' | 'skip' | 'tick' | 'countdown' | 'go' | 'gameOver' | 'streak';

interface SoundContextValue {
  play: (sound: SoundName) => void;
  isEnabled: boolean;
}

const SoundContext = createContext<SoundContextValue | null>(null);

// Sound URLs - using free sound effects (you can replace with actual sound files)
// For now, we'll create placeholder sounds using Web Audio API
function createBeep(frequency: number, duration: number, type: OscillatorType = 'sine'): () => void {
  return () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  };
}

// Placeholder sound generators
const soundGenerators: Record<SoundName, () => void> = {
  correct: createBeep(880, 0.15, 'sine'), // High pitch success
  skip: createBeep(220, 0.1, 'sawtooth'), // Low pitch skip
  tick: createBeep(440, 0.05, 'sine'), // Short tick
  countdown: createBeep(660, 0.3, 'sine'), // Countdown beep
  go: createBeep(1047, 0.4, 'square'), // GO! sound
  gameOver: createBeep(330, 0.5, 'triangle'), // Game over
  streak: createBeep(1320, 0.2, 'sine'), // Streak sound
};

export function SoundProvider({ children }: { children: ReactNode }) {
  const { state } = useGame();

  const play = useCallback((sound: SoundName) => {
    if (!state.soundEnabled) return;

    // Use the generator for now (can be replaced with actual Howl sounds later)
    try {
      soundGenerators[sound]();
    } catch (e) {
      // Silently fail if audio context not available
    }
  }, [state.soundEnabled]);

  const value: SoundContextValue = {
    play,
    isEnabled: state.soundEnabled,
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
