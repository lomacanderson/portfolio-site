import type { ReactNode } from 'react';

interface CodeWindowProps {
  /** Shown in the editor tab, e.g. "Hello.java". */
  filename: string;
  children: ReactNode;
  /** Classes for the outer frame (width, margins, visibility). */
  className?: string;
  /** Classes for the code area (font size). */
  codeClassName?: string;
  /** Let wide code scroll sideways; turn off for snippets whose width animates. */
  scroll?: boolean;
}

/** A code sample framed like an editor tab, so the filename tells you the language. */
export function CodeWindow({ filename, children, className = '', codeClassName = '', scroll = true }: CodeWindowProps) {
  return (
    <figure className={`overflow-hidden rounded-lg border border-zinc-800 bg-[#0f1115] shadow-xl shadow-zinc-900/10 dark:shadow-black/40 ${className}`}>
      <figcaption className="flex border-b border-zinc-800 bg-[#16181d]">
        <span className="-mb-px border-t-2 border-r border-t-accent-400 border-r-zinc-800 bg-[#0f1115] px-4 py-1.5 font-mono text-xs text-zinc-300">
          {filename}
        </span>
      </figcaption>
      <pre className={`p-4 font-mono leading-relaxed text-zinc-100 ${scroll ? 'overflow-x-auto' : 'overflow-hidden'} ${codeClassName}`}>
        {children}
      </pre>
    </figure>
  );
}
