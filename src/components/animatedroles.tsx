import { useEffect, useRef } from "react";
import { animate } from "animejs";

// Python-list punctuation around each role, set in the code font so it reads as syntax.
const punct = "font-mono text-lg md:text-xl relative md:bottom-1 text-zinc-400 dark:text-zinc-500";

export default function AnimatedRoles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const lines = containerRef.current.querySelectorAll("p");

    // Hide all lines initially
    lines.forEach((line) => {
      line.style.opacity = "0";
      line.style.transform = "translateY(-10px)";
    });

    const handleRoleTyped = (e: Event) => {
      const customEvent = e as CustomEvent<{ index: number }>;
      const { index } = customEvent.detail;
      const line = lines[index];
      if (line) {
        animate(line, {
          opacity: [0, 1],
          translateY: [-10, 0],
          easing: "easeOutExpo",
          duration: 600,
        });
      }
    };

    window.addEventListener('role-typed', handleRoleTyped);
    return () => {
      window.removeEventListener('role-typed', handleRoleTyped);
    };
  }, []);

  return (
    <div ref={containerRef} className="text-3xl lg:text-4xl font-semibold tracking-tight leading-snug py-3 md:py-4 lg:py-5 text-zinc-800 dark:text-zinc-100">
      <p id="role-0">
        <span className={punct}>['</span>Computer Science Student at{' '}
            <a
                href="https://engineering.oregonstate.edu/EECS"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline underline-offset-4 text-orange-600 dark:text-orange-400 font-extrabold">Oregon State</a>
        <span className={punct}>',</span>
      </p>
      <p id="role-1">
        <span className={punct}>'</span>Software Engineering Intern at{' '}
        <a
                href="https://www.kimley-horn.com/solutions/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline underline-offset-4 text-red-700 dark:text-red-400 font-extrabold">Kimley-Horn</a>
        <span className={punct}>',</span>
      </p>
      <p id="role-2">
        <span className={punct}>'</span>Future Software Engineer
        <span className={punct}>',</span>
      </p>
      <p id="role-3">
        <span className={punct}>'</span>Computer Nerd
        <span className={punct}>',</span>
      </p>
      <p id="role-4">
        <span className={punct}>'</span>Creative
        <span className={punct}>']</span>
      </p>
    </div>
  );
}
