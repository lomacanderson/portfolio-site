import { FaGithub, FaExternalLinkAlt, FaImage } from 'react-icons/fa';
import { SiDevpost } from 'react-icons/si';

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  devpostUrl?: string;
}

const linkClass = 'inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200';

export function ProjectCard({
  title,
  description,
  imageUrl,
  tags,
  githubUrl,
  liveUrl,
  devpostUrl,
}: ProjectCardProps) {
  return (
    <article className="flex flex-col h-full rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="relative overflow-hidden aspect-video bg-zinc-100 dark:bg-zinc-800 shrink-0 border-b border-zinc-200 dark:border-zinc-800">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`Screenshot of ${title}`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-zinc-400 dark:text-zinc-500">
            <FaImage className="text-3xl" aria-hidden="true" />
            <span className="text-xs font-medium">Screenshot coming soon</span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-snug">
          {title}
        </h3>

        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 flex-1">
          {description}
        </p>

        <ul className="flex flex-wrap gap-1.5" aria-label="Built with">
          {tags.map((tag) => (
            <li
              key={tag}
              className="text-xs font-semibold leading-5 px-2 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
            >
              {tag}
            </li>
          ))}
        </ul>

        {(githubUrl || liveUrl || devpostUrl) && (
          <div className="flex items-center gap-5 pt-3 mt-1 border-t border-zinc-100 dark:border-zinc-800">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkClass} text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white`}
                aria-label={`${title} source code on GitHub`}
              >
                <FaGithub aria-hidden="true" />
                <span>Source</span>
              </a>
            )}
            {devpostUrl && (
              <a
                href={devpostUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkClass} text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white`}
                aria-label={`${title} on Devpost`}
              >
                <SiDevpost aria-hidden="true" />
                <span>Devpost</span>
              </a>
            )}
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkClass} text-accent-700 dark:text-accent-400 hover:text-accent-800 dark:hover:text-accent-300`}
                aria-label={`Open ${title}`}
              >
                <FaExternalLinkAlt className="text-xs" aria-hidden="true" />
                <span>Live site</span>
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
