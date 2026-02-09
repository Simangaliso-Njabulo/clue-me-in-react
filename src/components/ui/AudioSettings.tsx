import { motion } from 'framer-motion';
import { useSound } from '../../context/SoundContext';
import { GlassCard } from './GlassCard';

interface AudioSettingsProps {
  compact?: boolean;
}

export function AudioSettings({ compact = false }: AudioSettingsProps) {
  const { settings, updateSettings, toggleSound, play } = useSound();

  const handleVolumeChange = (key: 'masterVolume' | 'sfxVolume', value: number) => {
    updateSettings({ [key]: value });
    // Play a test sound when adjusting
    play('buttonClick');
  };

  if (compact) {
    // Compact mode: just a mute toggle button
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          toggleSound();
          play('buttonClick');
        }}
        className={`p-3 rounded-xl transition-all ${
          settings.enabled
            ? 'text-neon-blue'
            : 'text-text-muted'
        }`}
        title={settings.enabled ? 'Mute sounds' : 'Unmute sounds'}
      >
        {settings.enabled ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        )}
      </motion.button>
    );
  }

  // Full settings panel
  return (
    <GlassCard variant="elevated" neonBorder="cyan" className="p-6 w-full max-w-sm">
      <h3 className="font-display font-bold text-lg text-text-primary mb-4 flex items-center gap-2">
        <span className="text-neon-blue">Sound Settings</span>
      </h3>

      {/* Sound Toggle */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-text-secondary">Sound Effects</span>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            toggleSound();
            play('buttonClick');
          }}
          className={`relative w-14 h-8 rounded-full transition-colors ${
            settings.enabled ? 'bg-neon-green' : 'bg-bg-tertiary'
          }`}
        >
          <motion.div
            className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
            animate={{ left: settings.enabled ? '1.75rem' : '0.25rem' }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </motion.button>
      </div>

      {/* Volume Sliders */}
      <div className="space-y-4">
        {/* Master Volume */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-text-secondary">Master Volume</label>
            <span className="text-sm text-neon-blue">{Math.round(settings.masterVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.masterVolume}
            onChange={(e) => handleVolumeChange('masterVolume', parseFloat(e.target.value))}
            disabled={!settings.enabled}
            className="w-full h-2 bg-bg-tertiary rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:bg-neon-blue [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(56,189,248,0.5)]
              [&::-webkit-slider-thumb]:cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* SFX Volume */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-text-secondary">SFX Volume</label>
            <span className="text-sm text-neon-blue">{Math.round(settings.sfxVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.sfxVolume}
            onChange={(e) => handleVolumeChange('sfxVolume', parseFloat(e.target.value))}
            disabled={!settings.enabled}
            className="w-full h-2 bg-bg-tertiary rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:bg-neon-blue [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(56,189,248,0.5)]
              [&::-webkit-slider-thumb]:cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* Test Sound Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => play('correct')}
        disabled={!settings.enabled}
        className="w-full mt-6 py-2 px-4 rounded-lg bg-neon-blue/20 text-neon-blue
          border border-neon-blue/30 font-display text-sm
          hover:bg-neon-blue/30 transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Test Sound
      </motion.button>
    </GlassCard>
  );
}
