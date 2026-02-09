import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useSound } from '../../context/SoundContext';
import { GlassCard } from '../ui/GlassCard';
import { Icon } from '../ui/Icon';
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
    <GlassCard variant="elevated" neonBorder="cyan" className="team-setup">
      <h3 className="team-setup-title">
        <Icon name="users" size={20} className="inline-block align-middle mr-2" />Team Setup
      </h3>

      <form onSubmit={handleSubmit} className="team-setup-form">
        {/* Team 1 */}
        <div className="team-setup-field">
          <label className="team-setup-label">
            <span className="team-setup-label--team1">Team 1</span> Name
          </label>
          <input
            type="text"
            value={team1Name}
            onChange={(e) => setTeam1Name(e.target.value)}
            placeholder="Team 1"
            maxLength={20}
            className="team-setup-input team-setup-input--team1"
          />
        </div>

        {/* VS Divider */}
        <div className="team-setup-divider">
          <div className="team-setup-divider-line" />
          <span className="team-setup-divider-text">VS</span>
          <div className="team-setup-divider-line" />
        </div>

        {/* Team 2 */}
        <div className="team-setup-field">
          <label className="team-setup-label">
            <span className="team-setup-label--team2">Team 2</span> Name
          </label>
          <input
            type="text"
            value={team2Name}
            onChange={(e) => setTeam2Name(e.target.value)}
            placeholder="Team 2"
            maxLength={20}
            className="team-setup-input team-setup-input--team2"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="team-setup-submit"
        >
          <NeonButton type="submit" variant="primary" size="lg" className="w-full">
            Start Battle!
          </NeonButton>
        </motion.div>
      </form>
    </GlassCard>
  );
}
