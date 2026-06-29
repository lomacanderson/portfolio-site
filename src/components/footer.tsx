import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiDevpost } from "react-icons/si";
export function Footer() {
    return (
        <footer className="p-4 px-10 md:px-15 lg:px-25 flex text-lg md:text-xl border-t border-zinc-100 dark:border-zinc-900 text-zinc-550 dark:text-zinc-400 transition-colors duration-300">
            <p>&copy;{new Date().getFullYear()} Logan Anderson</p>
            <div className="flex ml-auto">
                <a
                    href="https://github.com/lomacanderson"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-3 md:mx-5 hover:text-zinc-900 dark:hover:text-white transition-colors">
                    <FaGithub />
                </a>
                <a
                    href="https://www.linkedin.com/in/logan-m-anderson/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                    <FaLinkedin />
                </a>
                <a
                    href="https://devpost.com/lomacanderson/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-3 md:mx-5 hover:text-cyan-900 dark:hover:text-cyan-400 transition-colors">
                    <SiDevpost />
                </a>
            </div>
        </footer>
    )
}