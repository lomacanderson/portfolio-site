import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaCode } from 'react-icons/fa';

interface ExperienceItem {
  company: string;
  role: string;
  dates: string;
  location: string;
  type: 'work' | 'education' | 'project';
  logo: ReactNode;
  bullets: string[];
  skills: string[];
}

export function Experience() {
  const [activeIndex, setActiveIndex] = useState(0);

  const experiences: ExperienceItem[] = [
    {
      company: 'Kimley-Horn',
      role: 'Software Engineering Intern (Summer 2026)',
      dates: 'Jun 2026 – Present',
      location: 'Phoenix, AZ',
      type: 'work',
      logo: (
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRijCOISmhmKr6UGr4fU8j1bgNE8pWhmudeFLhMFqO4JA&s=10"
          alt="Kimley-Horn Logo"
          className="w-12 h-12 rounded-md object-contain shrink-0 bg-white border border-zinc-200 dark:border-zinc-800 p-1"
        />
      ),
      bullets: [
        'Software Engineering Intern returning to the smart cities software team.',
        'Designing, coding, and improving next-generation ITS software using C# .NET and WPF.',
        'Building on client-based traffic engineering and simulation software development from Summer 2025.'
      ],
      skills: ['C#', '.NET', 'WPF', 'XAML', 'ATMS Software', 'AI Engineering']
    },
    {
      company: 'Oregon State University',
      role: 'Undergraduate Learning Assistant (CS)',
      dates: 'Mar 2026 – Jun 2026',
      location: 'Corvallis, OR',
      type: 'work',
      logo: (
        <img
          src="https://yt3.googleusercontent.com/ytc/AIdro_lVKnhjEt8o76THGADFw6WuSkBCxTQgOmMb7yhxa5z7UpI=s900-c-k-c0x00ffffff-no-rj"
          alt="Oregon State University Logo"
          className="w-12 h-12 rounded-md object-contain shrink-0 bg-white border border-zinc-200 dark:border-zinc-800 p-0.5"
        />
      ),
      bullets: [
        'Served as an Undergraduate Learning Assistant (ULA) for CS 261 - Data Structures at the College of Engineering.',
        'Mentored and guided students in understanding complexity analysis, linked lists, trees, graphs, heaps, and hash tables.',
        'Assisted other instructional staff with evaluation and assignment/exam grading',
        'Held weekly coding office hours to debug student projects in Python and review data flow logic.'
      ],
      skills: ['Data Structures', 'Algorithms', 'Python', 'Academic Support', 'Mentorship']
    },
    {
      company: 'Kimley-Horn',
      role: 'Software Engineering Intern (Summer 2025)',
      dates: 'Jun 2025 – Sep 2025',
      location: 'Phoenix, AZ',
      type: 'work',
      logo: (
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRijCOISmhmKr6UGr4fU8j1bgNE8pWhmudeFLhMFqO4JA&s=10"
          alt="Kimley-Horn Logo"
          className="w-12 h-12 rounded-md object-contain shrink-0 bg-white border border-zinc-200 dark:border-zinc-800 p-1"
        />
      ),
      bullets: [
        'Wrote 10000+ lines of C#/XAML .NET WPF code merged into KITS ATMS software.',
        'Led development efforts of 8 Intelligent Transportation System configuration pages.',
        'Doubled efficiency of page usage in public agencies covering areas totaling 30M+ people.',
        'Demonstrated firmwide, client-based impact, resulting in offer to return in June 2026.'
      ],
      skills: ['C#', '.NET', 'WPF', 'XAML', 'ATMS Software']
    },
    {
      company: 'Oregon State University',
      role: 'B.S. in Computer Science',
      dates: '2024 – 2027 (Expected)',
      location: 'Corvallis, OR',
      type: 'education',
      logo: (
        <img
          src="https://yt3.googleusercontent.com/ytc/AIdro_lVKnhjEt8o76THGADFw6WuSkBCxTQgOmMb7yhxa5z7UpI=s900-c-k-c0x00ffffff-no-rj"
          alt="Oregon State University Logo"
          className="w-12 h-12 rounded-md object-contain shrink-0 bg-white border border-zinc-200 dark:border-zinc-800 p-0.5"
        />
      ),
      bullets: [
        'Completed major coursework in topics like Data Structures, Analysis of Algorithms, Databases, and Software Engineering.',
        'Member of Association for Computing Machinery (ACM), App Development Club, Google Developer Group, and Hackathon Club.',
        'Made honor roll for academic excellence in multiple terms.',
        'Participated in multiple hackathons, winning 2nd place in UW Dubhacks 2025.'
      ],
      skills: ['Software Engineering', 'DSA', 'Hackathons', 'Operating Systems', 'Machine Learning']
    },
    {
      company: 'South Puget Sound Community College',
      role: 'Associate of Arts - AA',
      dates: '2022 – 2024',
      location: 'Olympia, WA',
      type: 'education',
      logo: (
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9IXZCgnWIeHqCukBvDS8m9UAl2t-2Xg-OEeG5fSa_9LDDE6ucb0crdnDy&s=10"
          alt="South Puget Sound Community College Logo"
          className="w-12 h-12 rounded-md object-contain shrink-0 bg-white border border-zinc-200 dark:border-zinc-800 p-0.5"
        />
      ),
      bullets: [
        'Earned an Associate of Arts (AA) degree, completing core computer science electives and general education.',
        'Member of the Mad Hatter (Computer Science) Club, collaborating on group programming projects.',
        'Studied general programming logic, advanced algebra, and foundational computing structures.'
      ],
      skills: ['Programming', 'Algorithms', 'Foundational CS', 'Collaboration']
    }
  ];

  // Vertical tabs: arrow keys move between entries, like a native tab list.
  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (index + 1) % experiences.length;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (index - 1 + experiences.length) % experiences.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = experiences.length - 1;
    else return;
    e.preventDefault();
    setActiveIndex(next);
    document.getElementById(`experience-tab-${next}`)?.focus();
  };

  return (
    <section id="experience" className="py-16 md:py-24">
      <h2 className="mb-10 text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Experience and education</h2>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Entry list, drawn as a route: newest stop at the top, each logo a stop on the line */}
        <div role="tablist" aria-orientation="vertical" aria-label="Experience and education" className="flex flex-col w-full md:w-2/5 shrink-0">
          {experiences.map((exp, index) => {
            const isActive = index === activeIndex;
            const isCurrent = exp.dates.includes('Present');
            // Each row draws its half of the line above and below its logo, so
            // the line always runs exactly from the first logo to the last.
            const segment = 'absolute left-[35px] w-0.5 h-1/2 bg-zinc-300 dark:bg-zinc-700';
            return (
              <button
                key={exp.company + '-' + exp.dates}
                id={`experience-tab-${index}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`experience-panel-${index}`}
                tabIndex={isActive ? 0 : -1}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                onKeyDown={(e) => onTabKeyDown(e, index)}
                className={`group relative flex items-center gap-4 py-3 pl-3 pr-4 rounded-xl text-left cursor-pointer select-none transition-colors duration-200 ${
                  isActive ? 'bg-zinc-100 dark:bg-zinc-900' : ''
                }`}
              >
                {index > 0 && <span className={`${segment} top-0`} aria-hidden="true" />}
                {index < experiences.length - 1 && <span className={`${segment} top-1/2`} aria-hidden="true" />}

                <span
                  className={`relative z-10 flex shrink-0 rounded-lg transition-shadow duration-200 ${
                    isActive ? 'ring-2 ring-accent-400 ring-offset-2 ring-offset-zinc-100 dark:ring-offset-zinc-900' : ''
                  }`}
                >
                  {exp.logo}
                </span>

                <span className="flex flex-col min-w-0">
                  <span className={`font-bold text-base leading-snug transition-colors duration-200 ${
                    isActive
                      ? 'text-zinc-900 dark:text-white'
                      : 'text-zinc-700 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white'
                  }`}>
                    {exp.company}
                  </span>
                  <span className="text-sm leading-snug text-zinc-600 dark:text-zinc-400 mt-0.5">
                    {exp.role}
                  </span>
                  <span className="text-sm tabular-nums text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-1.5">
                    {isCurrent && <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />}
                    {exp.dates}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Details (grid-stacked so switching never shifts layout) */}
        <div className="grid grid-cols-1 grid-rows-1 flex-1 min-w-0">
          {experiences.map((exp, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={exp.company + '-' + exp.dates}
                id={`experience-panel-${index}`}
                role="tabpanel"
                aria-labelledby={`experience-tab-${index}`}
                inert={!isActive}
                className={`col-start-1 row-start-1 flex flex-col justify-between bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 md:p-8 backdrop-blur-md transition-opacity duration-200 ease-out ${
                  isActive
                    ? 'opacity-100 z-10'
                    : 'opacity-0 pointer-events-none z-0'
                }`}
              >
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-zinc-200 dark:border-zinc-800">
                    <div>
                      <h3 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-start gap-2.5 leading-tight">
                        {exp.type === 'education' ? (
                          <FaGraduationCap className="text-accent-600 dark:text-accent-400 text-2xl shrink-0 mt-0.5" aria-hidden="true" />
                        ) : exp.type === 'work' ? (
                          <FaBriefcase className="text-accent-600 dark:text-accent-400 text-xl shrink-0 mt-1" aria-hidden="true" />
                        ) : (
                          <FaCode className="text-accent-600 dark:text-accent-400 text-xl shrink-0 mt-1" aria-hidden="true" />
                        )}
                        {exp.role}
                      </h3>
                      <p className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mt-1">
                        {exp.company}
                      </p>
                    </div>

                    <div className="flex flex-col sm:items-end text-sm tabular-nums text-zinc-500 dark:text-zinc-400 gap-1.5 shrink-0 sm:pt-1.5">
                      <span className="flex items-center gap-2">
                        <FaCalendarAlt aria-hidden="true" />
                        {exp.dates}
                      </span>
                      <span className="flex items-center gap-2">
                        <FaMapMarkerAlt aria-hidden="true" />
                        {exp.location}
                      </span>
                    </div>
                  </div>

                  <ul className="mt-6 space-y-3 list-disc pl-5 marker:text-accent-600 dark:marker:text-accent-400">
                    {exp.bullets.map((bullet, i) => (
                      <li key={i} className="pl-1 text-sm md:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                  <h4 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-3">
                    Skills and tools
                  </h4>
                  <ul className="flex flex-wrap gap-1.5">
                    {exp.skills.map((skill) => (
                      <li
                        key={skill}
                        className="text-xs font-semibold leading-5 px-2 rounded-md bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
