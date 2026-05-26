'use client';

import { cn } from '@/lib/utils';

interface EqualizerProps {
  isPlaying: boolean;
  className?: string;
  color?: string;
}

export function Equalizer({ isPlaying, className, color = '#1aff8c' }: EqualizerProps) {
  const bars = [
    { height: '60%', delay: '0s', duration: '0.8s' },
    { height: '100%', delay: '0.2s', duration: '1.1s' },
    { height: '40%', delay: '0.4s', duration: '0.9s' },
    { height: '80%', delay: '0.1s', duration: '1.3s' },
  ];

  return (
    <div className={cn('flex items-end gap-0.5 h-4', className)}>
      {bars.map((bar, i) => (
        <div
          key={i}
          className="w-0.5 rounded-full"
          style={{
            backgroundColor: color,
            height: isPlaying ? bar.height : '30%',
            animation: isPlaying
              ? `equalizer ${bar.duration} ease-in-out infinite ${bar.delay}`
              : 'none',
            transition: 'height 0.3s ease',
          }}
        />
      ))}
    </div>
  );
}
