import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiDevpost } from "react-icons/si";

const secondary = "inline-flex items-center gap-2 rounded-lg border border-zinc-300 dark:border-zinc-700 px-5 py-3 font-semibold text-zinc-800 dark:text-zinc-100 hover:border-zinc-500 dark:hover:border-zinc-500 transition-colors";

export function Contact() {
    return (
        <section id="contact" className="py-16 md:py-24">
            <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                    Let's talk
                </h2>
                <p className="mt-4 text-lg md:text-xl leading-relaxed text-zinc-600 dark:text-zinc-400">
                    Want to talk about a role, a project, or anything on this page? Send me a message on LinkedIn, or see more of my work on GitHub and Devpost.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                    <a
                        href="https://www.linkedin.com/in/logan-m-anderson/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-accent-400 px-5 py-3 font-bold text-zinc-950 hover:bg-accent-300 transition-colors"
                    >
                        <FaLinkedin aria-hidden="true" />
                        Message me on LinkedIn
                    </a>
                    <a href="https://github.com/lomacanderson" target="_blank" rel="noopener noreferrer" className={secondary}>
                        <FaGithub aria-hidden="true" />
                        GitHub
                    </a>
                    <a href="https://devpost.com/lomacanderson/" target="_blank" rel="noopener noreferrer" className={secondary}>
                        <SiDevpost aria-hidden="true" />
                        Devpost
                    </a>
                </div>
            </div>
        </section>
    )
}
