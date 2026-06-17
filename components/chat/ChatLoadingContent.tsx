"use client";

export interface LoadingContent {
  currentRole: string;
  latestProject: string;
  topSkills: string;
}

export default function ChatLoadingContent({
  content,
}: {
  content: LoadingContent;
}) {
  return (
    <div className="mb-4 space-y-3">
      <p className="font-mono text-[12px] uppercase tracking-wider text-secondary">
        While the model loads, here&apos;s a quick look at my work…
      </p>
      <div className="rounded-card bg-surface p-4 text-[14px] text-primary">
        <span className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-secondary">
          Current role
        </span>
        {content.currentRole}
      </div>
      <div className="rounded-card bg-surface p-4 text-[14px] text-primary">
        <span className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-secondary">
          Latest project
        </span>
        {content.latestProject}
      </div>
      <div className="rounded-card bg-surface p-4 text-[14px] text-primary">
        <span className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-secondary">
          Top skills
        </span>
        {content.topSkills}
      </div>
    </div>
  );
}
