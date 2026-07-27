import { useState } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaCode } from 'react-icons/fa';

interface ExperienceItem {
  company: string;
  role: string;
  dates: string;
  location: string;
  type: 'work' | 'education' | 'project';
  logo: React.ReactNode;
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
          className="w-12 h-12 rounded-xl object-contain shrink-0 bg-white border border-zinc-200 dark:border-zinc-800 p-1"
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
          className="w-12 h-12 rounded-xl object-contain shrink-0 bg-white border border-zinc-200 dark:border-zinc-800 p-0.5"
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
          className="w-12 h-12 rounded-xl object-contain shrink-0 bg-white border border-zinc-200 dark:border-zinc-800 p-1"
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
          className="w-12 h-12 rounded-xl object-contain shrink-0 bg-white border border-zinc-200 dark:border-zinc-800 p-0.5"
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
          className="w-12 h-12 rounded-xl object-contain shrink-0 bg-white border border-zinc-200 dark:border-zinc-800 p-0.5"
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

  return (
    <section id="experience" className="py-16 border-t border-zinc-100 dark:border-zinc-900 transition-colors duration-300">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white">Experience & Education</h2>
        <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
          My academic achievements, professional milestones, and contributions to the developer community.
        </p>
        <div className="mt-3 h-1 w-16 rounded-full bg-teal-500" />
      </div>

      {/* Main Split Layout */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Left Side: Experience List */}
        <div className="flex flex-col gap-4 w-full md:w-2/5 shrink-0">
          {experiences.map((exp, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={exp.company + '-' + exp.dates}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                className={`flex gap-4 p-5 rounded-2xl border transition-all duration-300 cursor-pointer select-none ${
                  isActive
                    ? 'border-teal-500/80 bg-teal-50/20 dark:bg-teal-950/10 shadow-md shadow-teal-500/5'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-700'
                }`}
              >
                {/* Logo wrapper */}
                {exp.logo}

                {/* Text summary */}
                <div className="flex flex-col justify-center min-w-0">
                  <h3 className="font-bold text-zinc-900 dark:text-white truncate text-base leading-snug">
                    {exp.company}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 truncate font-medium mt-0.5">
                    {exp.role}
                  </p>
                  <span className="text-xs text-zinc-500 dark:text-zinc-500 font-medium mt-1.5 flex items-center gap-1.5">
                    <FaCalendarAlt className="text-[10px]" />
                    {exp.dates}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Experience Details (Grid layered for zero layout shift) */}
        <div className="grid grid-cols-1 grid-rows-1 flex-1 min-w-0">
          {experiences.map((exp, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={exp.company + '-' + exp.dates}
                className={`col-start-1 row-start-1 flex flex-col justify-between bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-md transition-opacity duration-250 ease-out ${
                  isActive
                    ? 'opacity-100 pointer-events-auto z-10'
                    : 'opacity-0 pointer-events-none z-0'
                }`}
              >
                <div>
                  {/* Header info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-200/60 dark:border-zinc-800/80">
                    <div>
                      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
                        {exp.type === 'education' ? (
                          <FaGraduationCap className="text-teal-500 text-2xl shrink-0" />
                        ) : exp.type === 'work' ? (
                          <FaBriefcase className="text-teal-500 text-xl shrink-0" />
                        ) : (
                          <FaCode className="text-teal-500 text-xl shrink-0" />
                        )}
                        {exp.role}
                      </h3>
                      <h4 className="text-lg font-semibold text-teal-600 dark:text-teal-400 mt-1">
                        {exp.company}
                      </h4>
                    </div>

                    {/* Meta details */}
                    <div className="flex flex-col sm:items-end text-sm text-zinc-500 dark:text-zinc-400 gap-1.5 font-medium shrink-0">
                      <span className="flex items-center gap-2">
                        <FaCalendarAlt className="text-zinc-400 dark:text-zinc-500" />
                        {exp.dates}
                      </span>
                      <span className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-zinc-400 dark:text-zinc-500" />
                        {exp.location}
                      </span>
                    </div>
                  </div>

                  {/* Bullets */}
                  <ul className="mt-6 space-y-3">
                    {exp.bullets.map((bullet, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm md:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed"
                      >
                        <span className="text-teal-500 mt-1.5 font-bold text-lg select-none shrink-0 leading-none">
                          •
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills Badges */}
                <div className="mt-8 pt-6 border-t border-zinc-200/60 dark:border-zinc-800/80">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-550 dark:text-zinc-400 block mb-3">
                    Skills & Technologies
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-200/50 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 border border-zinc-300/40 dark:border-zinc-700/50 transition-colors duration-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
