"use client";

import { ExternalLink } from "lucide-react";
import { track } from "@vercel/analytics";
import { GithubIcon } from "@/components/ui/icons";

interface ProjectLinksProps {
  name: string;
  github: string;
  demo?: string;
}

export default function ProjectLinks({ name, github, demo }: ProjectLinksProps) {
  return (
    <div className="flex items-center gap-2.5 text-secondary">
      <a
        href={github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${name} on GitHub`}
        onClick={() => track("project_link_clicked", { project: name, type: "github" })}
        className="transition-colors hover:text-primary"
      >
        <GithubIcon />
      </a>
      {demo ? (
        <a
          href={demo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} live demo`}
          onClick={() => track("project_link_clicked", { project: name, type: "demo" })}
          className="transition-colors hover:text-primary"
        >
          <ExternalLink size={16} />
        </a>
      ) : null}
    </div>
  );
}
