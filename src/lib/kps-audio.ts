// Tiny audio helper. Tries /public/audio files, falls back to a synth beep.

export const REACTION_FILES: Record<string, string> = {
  "Enthokkeya ee kaanikkunne?": "/audio/enthokkeya.mp3",
  "Ayyoo!": "/audio/ayyoo.mp3",
  "Daivame…": "/audio/daivame.mp3",
  "Nee poda!": "/audio/nee-poda.mp3",
  "Oru rakshayum illa.": "/audio/oru-rakshayum.mp3",
  "Adipoli!": "/audio/adipoli.mp3",
  "Enthuvaade?": "/audio/enthuvaade.mp3",
};

let ctx: AudioContext | null = null;

function beep(volume: number, freq: number) {
  if (typeof window === "undefined") return;
  try {
    ctx ??= new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume * 0.2), ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.24);
  } catch {
    /* audio not available */
  }
}

export function playClip(src: string, volume: number, muted: boolean, fallbackFreq = 440) {
  if (muted || typeof window === "undefined") return;
  const audio = new Audio(src);
  audio.volume = Math.min(1, Math.max(0, volume));
  audio.play().catch(() => beep(volume, fallbackFreq));
}

export function playReaction(reaction: string, volume: number, muted: boolean) {
  const src = REACTION_FILES[reaction];
  if (src) playClip(src, volume, muted, 520);
}

export function playBlip(volume: number, muted: boolean) {
  playClip("/audio/blip.mp3", volume, muted, 880);
}
