import { useEffect, useRef } from "react";
import { animate } from "animejs";

export default function AnimatedRoles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const lines = containerRef.current.querySelectorAll("p");
    const delays = [2600, 8500, 13400, 16500, 19050];

    lines.forEach((line, index) => {
        animate(line, {
          opacity: [0, 1],
          translateY: [-10, 0],
          easing: "easeOutExpo",
          duration: 600,
          delay: delays[index],
        });
      });
  }, []);

  return (
    <div ref={containerRef} className="text-3xl lg:text-4xl py-3 md:py-4 lg:py-5">
      <p id="role-0">
        <span className="text-lg md:text-xl relative md:bottom-1.5">['</span>Computer Science Student at{' '}
            <a
                href="https://engineering.oregonstate.edu/EECS"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-orange-600 font-bold">Oregon State</a>
        <span className="text-lg md:text-xl relative md:bottom-1.5">',</span>
      </p>
      <p id="role-1">
        <span className="text-xl relative bottom-1.5">'</span>Software Engineering Intern at{' '}
        <a
                href="https://www.kimley-horn.com/solutions/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-red-800 font-bold">Kimley-Horn</a>
        <span className="text-lg md:text-xl relative md:bottom-1.5">',</span>
      </p>
      <p id="role-2">
        <span className="text-lg md:text-xl relative md:bottom-1.5">'</span>Future Software Engineer
        <span className="text-lg md:text-xl relative md:bottom-1.5">',</span>
      </p>
      <p id="role-3">
        <span className="text-lg md:text-xl relative md:bottom-1.5">'</span>Computer Nerd
        <span className="text-lg md:text-xl relative md:bottom-1.5">',</span>
      </p>
      <p id="role-4">
        <span className="text-lg md:text-xl relative md:bottom-1.5">'</span>Creative
        <span className="text-lg md:text-xl relative md:bottom-1.5">']</span>
      </p>
    </div>
  );
}
