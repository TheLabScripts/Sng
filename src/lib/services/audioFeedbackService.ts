type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

let scanAudioContext: AudioContext | null = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  const AudioContextCtor = window.AudioContext || (window as WebkitWindow).webkitAudioContext;
  if (!AudioContextCtor) return null;
  scanAudioContext ??= new AudioContextCtor();
  return scanAudioContext;
}

export async function primeScanAudio() {
  const context = getAudioContext();
  if (context?.state === "suspended") await context.resume();
}

export function playScanBeep() {
  const context = getAudioContext();
  if (!context || context.state !== "running") return;

  const now = context.currentTime;
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.13, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
  gain.connect(context.destination);

  [880, 1174].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    oscillator.connect(gain);
    oscillator.start(now + index * 0.055);
    oscillator.stop(now + 0.11 + index * 0.055);
  });

  window.navigator.vibrate?.(45);
}
