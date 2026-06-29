import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from './useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 shadow-md cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 overflow-hidden"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Sun Icon (visible in dark mode) */}
      <span
        className={`absolute transform transition-all duration-500 ease-out text-amber-500 text-xl ${
          theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
        }`}
      >
        <FiSun />
      </span>

      {/* Moon Icon (visible in light mode) */}
      <span
        className={`absolute transform transition-all duration-500 ease-out text-indigo-600 dark:text-indigo-400 text-xl ${
          theme === 'light' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
        }`}
      >
        <FiMoon />
      </span>
    </button>
  );
}
