/**
 * Audio Service - Synthesized sound effects using Web Audio API
 * No external audio files needed - keeps app size minimal
 */

export type SoundEffect =
  | 'correct'      // Player got word correct
  | 'skip'         // Player skipped word
  | 'tick'         // Timer tick
  | 'countdown'    // 3-2-1 countdown beep
  | 'go'           // GO! when game starts
  | 'gameOver'     // Round ended
  | 'streak'       // Multi-correct streak
  | 'warning'      // Timer warning (low time)
  | 'buttonClick'  // UI button interaction
  | 'cardFlip';    // Word card transition

interface AudioSettings {
  masterVolume: number;  // 0-1
  sfxVolume: number;     // 0-1
  enabled: boolean;
}

const DEFAULT_SETTINGS: AudioSettings = {
  masterVolume: 0.7,
  sfxVolume: 0.8,
  enabled: true,
};

class AudioService {
  private audioContext: AudioContext | null = null;
  private settings: AudioSettings = DEFAULT_SETTINGS;

  constructor() {
    this.loadSettings();
  }

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    // Resume if suspended (browsers require user interaction)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  private getVolume(): number {
    return this.settings.masterVolume * this.settings.sfxVolume;
  }

  // Load settings from localStorage
  private loadSettings(): void {
    try {
      const saved = localStorage.getItem('wordzapp_audio_settings');
      if (saved) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      this.settings = DEFAULT_SETTINGS;
    }
  }

  // Save settings to localStorage
  saveSettings(settings: Partial<AudioSettings>): void {
    this.settings = { ...this.settings, ...settings };
    try {
      localStorage.setItem('wordzapp_audio_settings', JSON.stringify(this.settings));
    } catch {
      // Storage not available
    }
  }

  getSettings(): AudioSettings {
    return { ...this.settings };
  }

  // Play a synthesized sound effect
  play(sound: SoundEffect): void {
    if (!this.settings.enabled) return;

    try {
      const ctx = this.getContext();
      const volume = this.getVolume();

      switch (sound) {
        case 'correct':
          this.playCorrect(ctx, volume);
          break;
        case 'skip':
          this.playSkip(ctx, volume);
          break;
        case 'tick':
          this.playTick(ctx, volume);
          break;
        case 'countdown':
          this.playCountdown(ctx, volume);
          break;
        case 'go':
          this.playGo(ctx, volume);
          break;
        case 'gameOver':
          this.playGameOver(ctx, volume);
          break;
        case 'streak':
          this.playStreak(ctx, volume);
          break;
        case 'warning':
          this.playWarning(ctx, volume);
          break;
        case 'buttonClick':
          this.playButtonClick(ctx, volume);
          break;
        case 'cardFlip':
          this.playCardFlip(ctx, volume);
          break;
      }
    } catch {
      // Audio not available
    }
  }

  // Success chime - two quick ascending notes
  private playCorrect(ctx: AudioContext, volume: number): void {
    const now = ctx.currentTime;

    // First note
    this.playTone(ctx, 880, now, 0.08, volume * 0.4, 'sine');
    // Second note (higher)
    this.playTone(ctx, 1318.5, now + 0.08, 0.12, volume * 0.5, 'sine');
  }

  // Skip sound - low descending tone
  private playSkip(ctx: AudioContext, volume: number): void {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);

    gain.gain.setValueAtTime(volume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Soft tick for timer
  private playTick(ctx: AudioContext, volume: number): void {
    const now = ctx.currentTime;
    this.playTone(ctx, 800, now, 0.03, volume * 0.15, 'sine');
  }

  // Countdown beep (3-2-1)
  private playCountdown(ctx: AudioContext, volume: number): void {
    const now = ctx.currentTime;
    this.playTone(ctx, 660, now, 0.15, volume * 0.4, 'sine');
  }

  // GO! sound - triumphant ascending chord
  private playGo(ctx: AudioContext, volume: number): void {
    const now = ctx.currentTime;
    // Play a quick major chord arpeggio
    this.playTone(ctx, 523.25, now, 0.15, volume * 0.3, 'sine');        // C5
    this.playTone(ctx, 659.25, now + 0.05, 0.15, volume * 0.3, 'sine'); // E5
    this.playTone(ctx, 783.99, now + 0.1, 0.2, volume * 0.4, 'sine');   // G5
    this.playTone(ctx, 1046.5, now + 0.15, 0.25, volume * 0.5, 'sine'); // C6
  }

  // Game over - descending tone
  private playGameOver(ctx: AudioContext, volume: number): void {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.4);

    gain.gain.setValueAtTime(volume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  // Streak bonus - sparkly ascending
  private playStreak(ctx: AudioContext, volume: number): void {
    const now = ctx.currentTime;
    const frequencies = [1046.5, 1318.5, 1568, 2093]; // C6, E6, G6, C7

    frequencies.forEach((freq, i) => {
      this.playTone(ctx, freq, now + i * 0.05, 0.1, volume * 0.25, 'sine');
    });
  }

  // Warning beep - urgent
  private playWarning(ctx: AudioContext, volume: number): void {
    const now = ctx.currentTime;
    this.playTone(ctx, 880, now, 0.08, volume * 0.35, 'square');
    this.playTone(ctx, 880, now + 0.12, 0.08, volume * 0.35, 'square');
  }

  // Button click - soft pop
  private playButtonClick(ctx: AudioContext, volume: number): void {
    const now = ctx.currentTime;
    this.playTone(ctx, 600, now, 0.04, volume * 0.2, 'sine');
  }

  // Card flip - whoosh-like
  private playCardFlip(ctx: AudioContext, volume: number): void {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    // White noise-like effect
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, now);

    gain.gain.setValueAtTime(volume * 0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Helper to play a simple tone
  private playTone(
    ctx: AudioContext,
    frequency: number,
    startTime: number,
    duration: number,
    volume: number,
    type: OscillatorType
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, startTime);

    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }
}

// Singleton instance
export const audioService = new AudioService();
