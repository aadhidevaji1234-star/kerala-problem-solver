import { Volume2, VolumeX } from "lucide-react";

export function AudioControls({
  muted,
  volume,
  onToggle,
  onVolume,
}: {
  muted: boolean;
  volume: number;
  onToggle: () => void;
  onVolume: (v: number) => void;
}) {
  return (
    <div className="glass-panel flex items-center gap-3 px-4 py-2">
      <button
        onClick={onToggle}
        aria-label={muted ? "Unmute" : "Mute"}
        className="text-foreground/80 transition-colors hover:text-primary"
      >
        {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={volume}
        onChange={(e) => onVolume(Number(e.target.value))}
        aria-label="Volume"
        className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
      />
    </div>
  );
}
