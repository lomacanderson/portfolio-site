import { HashLink as Link } from 'react-router-hash-link';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
    return (
        <header className="flex items-center sticky top-0 z-50 justify-between p-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 shadow-sm px-5 md:px-15 lg:px-25 transition-colors duration-300">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                <Link to="/#home" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                    Logan Anderson
                </Link>
            </h1>
            <div className="flex items-center gap-4 md:gap-6">
                <nav className="flex gap-4 md:gap-6 text-zinc-600 dark:text-zinc-300">
                    <Link to="/#home" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium">
                        Home
                    </Link>
                    <Link to="/#about" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium">
                        About
                    </Link>
                    {/* Uncomment these sections once made
                    <Link to="/#experience" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium">Experience</Link> 
                    <Link to="/#projects" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium">Projects</Link>
                    <Link to="/#contact" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium">Contact</Link>
                    <Link to="/#resume" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium">Resume</Link>*/}
                </nav>
                <div className="border-l border-zinc-200 dark:border-zinc-800 pl-4 md:pl-6 h-6 flex items-center">
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}