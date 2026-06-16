interface AuthorCardProps {
  name: string;
  bio: string;
}

export default function AuthorCard({ name, bio }: AuthorCardProps) {
  return (
    <div className="mt-16 flex items-start gap-4 border-t border-surface-alt pt-8">
      <div
        aria-hidden="true"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent font-semibold text-surface"
      >
        AV
      </div>
      <div>
        <p className="text-sm font-semibold text-primary">{name}</p>
        <p className="mt-1 text-sm leading-relaxed text-secondary">{bio}</p>
      </div>
    </div>
  );
}
