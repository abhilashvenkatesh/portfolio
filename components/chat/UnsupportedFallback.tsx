import Link from "next/link";

export default function UnsupportedFallback({
  email,
  linkedin,
}: {
  email: string;
  linkedin: string;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-start gap-4 py-16">
      <p className="font-mono text-sm text-accent">Chat unavailable</p>
      <h1 className="text-2xl font-semibold tracking-tight text-primary">
        This browser can&apos;t run the in-browser AI
      </h1>
      <p className="text-secondary">
        The chat runs entirely on-device and needs WebGPU (Chrome or Edge 113+).
        In the meantime, reach Abhilash directly:
      </p>
      <div className="flex flex-col gap-2">
        <a
          href={`mailto:${email}`}
          className="text-accent hover:underline"
        >
          {email}
        </a>
        <Link
          href={linkedin}
          className="text-accent hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </Link>
      </div>
    </div>
  );
}
