interface HeroStatsProps {
  stats: Array<{ value: string; label: string }>;
}

export default function HeroStats({ stats }: HeroStatsProps) {
  return (
    <div className="mt-16 flex flex-wrap justify-center gap-x-12 gap-y-6">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <div className="text-3xl font-semibold tracking-tight text-primary">
            {stat.value}
          </div>
          <div className="mt-1 font-mono text-sm text-secondary">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
