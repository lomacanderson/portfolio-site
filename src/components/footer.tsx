import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiDevpost } from "react-icons/si";

const LINKS = [
    { label: 'GitHub', href: 'https://github.com/lomacanderson', icon: <FaGithub /> },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/logan-m-anderson/', icon: <FaLinkedin /> },
    { label: 'Devpost', href: 'https://devpost.com/lomacanderson/', icon: <SiDevpost /> },
];

export function Footer() {
    return (
        <footer className="border-t border-zinc-200 dark:border-zinc-800 text-sm text-zinc-500 dark:text-zinc-400 transition-colors duration-300">
          <div className="mx-auto max-w-[112rem] py-6 px-5 md:px-15 lg:px-25 flex items-center">
            <p>&copy; {new Date().getFullYear()} Logan Anderson</p>
            <div className="flex items-center gap-5 ml-auto text-lg">
                {LINKS.map((l) => (
                    <a
                        key={l.label}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={l.label}
                        className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                        {l.icon}
                    </a>
                ))}
            </div>
          </div>
        </footer>
    )
}
