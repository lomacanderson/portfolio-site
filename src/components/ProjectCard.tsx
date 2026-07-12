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
    <article className="group flex flex-col rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-lg dark:hover:shadow-zinc-900/60 transition-all duration-300 hover:-translate-y-1 h-full">
      {/* Image — no zoom on hover, just card lifts */}
      <div className="relative overflow-hidden aspect-video bg-zinc-100 dark:bg-zinc-800 shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800 flex flex-col items-center justify-center gap-2">
            <FaImage className="text-3xl text-zinc-400 dark:text-zinc-500" />
            <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">Preview Coming Soon</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Title */}
        <h3 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-200 leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 flex-1">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Links */}
        {(githubUrl || liveUrl || devpostUrl) && (
          <div className="flex items-center gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors duration-200"
                aria-label={`View ${title} on GitHub`}
              >
                <FaGithub className="text-sm" />
                <span>Source</span>
              </a>
            )}
            {devpostUrl && (
              <a
                href={devpostUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-850 dark:hover:text-blue-200 transition-colors duration-200"
                aria-label={`View ${title} on Devpost`}
              >
                <SiDevpost className="text-xs" />
                <span>Devpost</span>
              </a>
            )}
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200 transition-colors duration-200"
                aria-label={`View ${title} live`}
              >
                <FaExternalLinkAlt className="text-[10px]" />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
