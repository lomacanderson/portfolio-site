// Resized from CartoonAvatar.png (5796px, 3 MB); 832px covers the largest 2x display size.
import avatar416 from '../assets/avatar-416.webp'
import avatar832 from '../assets/avatar-832.webp'
import { MdLocationPin } from "react-icons/md";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiDevpost } from "react-icons/si";
import { useLanguage } from "./LanguageContext";
import { CodeWindow } from "./CodeWindow";
import helloworld from "./snippets/helloworld";

const HELLO_FILES: Record<string, string> = {
    '': 'index.html',
    Python: 'hello.py',
    Java: 'Hello.java',
    JavaScript: 'hello.js',
    'C#': 'Hello.cs',
};

const SOCIALS = [
    { label: 'GitHub', href: 'https://github.com/lomacanderson', icon: <FaGithub /> },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/logan-m-anderson/', icon: <FaLinkedin /> },
    { label: 'Devpost', href: 'https://devpost.com/lomacanderson/', icon: <SiDevpost /> },
];

export function Home() {
    const { selLanguage } = useLanguage();
    return (
    <section id="home" className="pt-12 md:pt-16 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-10">
        <div className="@container flex-1 min-w-0">
            <CodeWindow
                filename={HELLO_FILES[selLanguage] ?? 'Hello.java'}
                className="w-fit max-w-full md:max-w-[460px] lg:max-w-[600px] mb-8"
                codeClassName="text-xs md:text-sm xl:text-base"
            >
              {helloworld[selLanguage] || helloworld['Java']}
            </CodeWindow>
            {/* "Anderson" is ~4.3em wide and can't wrap, so cap the size at 22% of the column (cqi). */}
            <h1 className="text-[clamp(3.75rem,min(11vw,22cqi),7.5rem)] font-extrabold leading-[0.9] tracking-[-0.035em] text-zinc-900 dark:text-white">
                Logan Anderson
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-base font-semibold">
                <a
                    href="https://www.google.com/maps/place/Phoenix,+AZ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                    <MdLocationPin className="text-lg" aria-hidden="true" />
                    Phoenix, AZ
                </a>
                <span className="hidden sm:block h-5 w-px bg-zinc-300 dark:bg-zinc-700" aria-hidden="true" />
                {SOCIALS.map((s) => (
                    <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-zinc-700 dark:text-zinc-300 hover:text-accent-700 dark:hover:text-accent-400 transition-colors">
                        <span className="text-lg" aria-hidden="true">{s.icon}</span>
                        {s.label}
                    </a>
                ))}
            </div>
        </div>
        <img
            src={avatar832}
            srcSet={`${avatar416} 416w, ${avatar832} 832w`}
            sizes="(min-width: 1024px) 26rem, (min-width: 768px) 20rem, 18rem"
            width={832}
            height={832}
            fetchPriority="high"
            alt="Illustrated portrait of Logan Anderson"
            className="w-72 md:w-80 lg:w-[26rem] shrink-0 self-center"
        />
    </section>
    )
}
