'use client';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number; // default 120
  strokeWidth?: number; // default 8
  className?: string;
  showLabel?: boolean;
  label?: string;
  color?: string;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  className = '',
  showLabel = true,
  label,
  color = 'hsl(var(--primary))',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      <svg className="-rotate-90 transform" height={size} width={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          opacity={0.3}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          className="transition-all duration-300 ease-in-out"
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          r={radius}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="font-bold text-2xl">{Math.round(progress)}%</div>
            {label && (
              <div className="mt-1 text-muted-foreground text-xs">{label}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
