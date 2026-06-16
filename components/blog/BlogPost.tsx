import { MDXRemote } from "next-mdx-remote/rsc";
import type { ReactNode } from "react";

const mdxComponents = {
  h1: (props: { children?: ReactNode }) => (
    <h1 className="mt-10 text-2xl font-bold tracking-tight text-primary" {...props} />
  ),
  h2: (props: { children?: ReactNode }) => (
    <h2 className="mt-8 text-xl font-semibold tracking-tight text-primary" {...props} />
  ),
  h3: (props: { children?: ReactNode }) => (
    <h3 className="mt-6 text-lg font-semibold tracking-tight text-primary" {...props} />
  ),
  p: (props: { children?: ReactNode }) => (
    <p className="mt-4 text-[15px] leading-7 text-secondary" {...props} />
  ),
  ul: (props: { children?: ReactNode }) => (
    <ul className="mt-4 flex list-none flex-col gap-2" {...props} />
  ),
  li: (props: { children?: ReactNode }) => (
    <li className="flex gap-3 text-[15px] leading-relaxed text-secondary">
      <span aria-hidden="true" className="shrink-0 text-accent">–</span>
      <span>{props.children}</span>
    </li>
  ),
  strong: (props: { children?: ReactNode }) => (
    <strong className="font-semibold text-primary" {...props} />
  ),
  em: (props: { children?: ReactNode }) => (
    <em className="italic" {...props} />
  ),
  a: (props: { children?: ReactNode; href?: string }) => (
    <a className="text-accent hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
  ),
  pre: (props: { children?: ReactNode }) => (
    <pre className="mt-4 overflow-x-auto rounded-md bg-surface-alt px-4 py-3 font-mono text-sm text-primary" {...props} />
  ),
  code: (props: { children?: ReactNode }) => (
    <code className="rounded bg-accent-dim px-1.5 py-0.5 font-mono text-sm text-accent" {...props} />
  ),
  blockquote: (props: { children?: ReactNode }) => (
    <blockquote
      className="mt-4 border-l-4 border-accent bg-accent-dim px-4 py-2 text-[15px] leading-7 text-secondary"
      {...props}
    />
  ),
};

export default async function BlogPost({ source }: { source: string }) {
  return (
    <div className="mt-8">
      <MDXRemote source={source} components={mdxComponents} />
    </div>
  );
}
