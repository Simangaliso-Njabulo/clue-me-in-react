import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useSound } from '../../context/SoundContext';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';

interface TeamSetupProps {
  onComplete: () => void;
}

export function TeamSetup({ onComplete }: TeamSetupProps) {
  const { setTeams } = useGame();
  const { play } = useSound();
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    play('buttonClick');
    setTeams(team1Name || 'Team 1', team2Name || 'Team 2');
    onComplete();
  };

  return (
    <GlassCard variant="elevated" neonBorder="purple" className="p-6 w-full max-w-md">
      <h3 className="font-display font-bold text-xl text-center text-text-primary mb-6">
        👥 Team Setup
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Team 1 */}
        <div>
          <label className="block text-sm text-text-secondary mb-2">
            <span className="text-neon-pink">Team 1</span> Name
          </label>
          <input
            type="text"
            value={team1Name}
            onChange={(e) => setTeam1Name(e.target.value)}
            placeholder="Team 1"
            maxLength={20}
            className="w-full px-4 py-3 rounded-xl bg-bg-tertiary border border-neon-pink/30
              text-text-primary placeholder-text-muted font-display
              focus:outline-none focus:border-neon-pink focus:ring-1 focus:ring-neon-pink/50
              transition-colors"
          />
        </div>

        {/* VS Divider */}
        <div className="flex items-center gap-4 py-2">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-text-muted font-display font-bold">VS</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Team 2 */}
        <div>
          <label className="block text-sm text-text-secondary mb-2">
            <span className="text-neon-cyan">Team 2</span> Name
          </label>
          <input
            type="text"
            value={team2Name}
            onChange={(e) => setTeam2Name(e.target.value)}
            placeholder="Team 2"
            maxLength={20}
            className="w-full px-4 py-3 rounded-xl bg-bg-tertiary border border-neon-cyan/30
              text-text-primary placeholder-text-muted font-display
              focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50
              transition-colors"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="pt-4"
        >
          <NeonButton type="submit" variant="primary" size="lg" className="w-full">
            Start Battle!
          </NeonButton>
        </motion.div>
      </form>
    </GlassCard>
  );
}
