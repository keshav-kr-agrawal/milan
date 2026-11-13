/**
 * Sacred Temple Sound Synthesizer via Web Audio API.
 * 100% offline, zero external audio asset dependencies.
 * Synthesizes pure harmonic brass temple bell (ఘంటానాదం / घंटी) and sacred resonance.
 */

class TempleAudioSynthesizer {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Rings a pure brass temple bell (ఘంటానాదం) with natural physical harmonics and soothing resonance.
   */
  public ringTempleBell(volume: number = 0.35) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Authentic South Indian Temple Brass Bell frequencies (Fundamental ~860Hz + harmonics)
      const harmonics = [
        { freq: 432, gain: 0.25, decay: 2.2 },   // Sacred Om 432Hz deep undertone
        { freq: 864, gain: 0.5, decay: 3.2 },    // Principal bell strike tone
        { freq: 1728, gain: 0.35, decay: 2.5 },  // First brass overtone
        { freq: 2592, gain: 0.2, decay: 1.8 },   // Shimmering bronze overtone
        { freq: 3456, gain: 0.12, decay: 1.2 },  // Metallic sparkle
      ];

      harmonics.forEach(({ freq, gain: hGain, decay }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Slight natural detune for authentic acoustic metal warmth
        osc.detune.setValueAtTime((Math.random() - 0.5) * 8, now);

        // Immediate strike followed by exponential decay
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(hGain * volume, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + decay);
      });
    } catch (e) {
      console.warn('Temple audio synthesis unavailable:', e);
    }
  }

  /**
   * Gentle auspicious chime for floating deepam (దీప సమర్పణ) or ritual completion.
   */
  public playAartiChime() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [528, 660, 792, 1056]; // Auspicious Solfeggio & Vedic harmonic chord

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 2.0);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 2.0);
      });
    } catch (e) {
      console.warn('Aarti chime synthesis unavailable:', e);
    }
  }

  /**
   * Authentic sacred Conch Shell (శంఖ ధ్వని / शंखनाद) resonance.
   */
  public soundShankha(volume: number = 0.3) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      // Conch pitch swell from 220Hz up to 440Hz and stabilize
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.8);
      osc.frequency.setValueAtTime(440, now + 2.2);
      osc.frequency.exponentialRampToValueAtTime(330, now + 3.0);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume * 0.4, now + 0.5);
      gain.gain.setValueAtTime(volume * 0.4, now + 2.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      // Low pass filter to soften the trumpet/conch sound
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 3.2);
    } catch (e) {
      console.warn('Shankha audio synthesis unavailable:', e);
    }
  }
}

export const templeAudio = new TempleAudioSynthesizer();
