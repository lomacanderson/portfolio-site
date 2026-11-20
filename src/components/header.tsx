import { useEffect, useState } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { FiMenu, FiX } from 'react-icons/fi';
import { ThemeToggle } from './ThemeToggle';

const LINKS = [
    { label: 'Home', to: '/#home' },
    { label: 'About', to: '/#about' },
    { label: 'Projects', to: '/#projects' },
    { label: 'Experience', to: '/#experience' },
    { label: 'Contact', to: '/#contact' },
];

const linkClass = 'hover:text-zinc-900 dark:hover:text-white transition-colors';

export function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (!menuOpen) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [menuOpen]);

    const close = () => setMenuOpen(false);

    return (
        <header className="sticky top-0 z-50 border-b border-zinc-200/70 dark:border-zinc-800/70 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors duration-300">
            <div className="mx-auto max-w-[112rem] flex items-center justify-between gap-4 py-3 px-5 md:px-15 lg:px-25">
                <Link to="/#home" onClick={close} className="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-white hover:text-accent-700 dark:hover:text-accent-400 transition-colors">
                    Logan Anderson
                </Link>
                <div className="flex items-center gap-2 md:gap-6">
                    <nav aria-label="Primary" className="hidden md:flex gap-6 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                        {LINKS.map((l) => (
                            <Link key={l.to} to={l.to} className={linkClass}>{l.label}</Link>
                        ))}
                    </nav>
                    <div className="md:border-l md:border-zinc-200 md:dark:border-zinc-800 md:pl-6 flex items-center">
                        <ThemeToggle />
                    </div>
                    <button
                        type="button"
                        onClick={() => setMenuOpen((o) => !o)}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-nav"
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        className="md:hidden size-10 grid place-items-center rounded-full text-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        {menuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>
            {menuOpen && (
                <nav id="mobile-nav" aria-label="Primary" className="md:hidden border-t border-zinc-200/70 dark:border-zinc-800/70 px-5 py-2">
                    <ul className="flex flex-col text-lg font-semibold text-zinc-700 dark:text-zinc-200">
                        {LINKS.map((l) => (
                            <li key={l.to}>
                                <Link to={l.to} onClick={close} className={`block py-2.5 ${linkClass}`}>{l.label}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </header>
    );
}
