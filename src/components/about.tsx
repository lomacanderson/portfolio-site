import { RoleType, DebugType } from "./type";
import AnimatedRoles from "./animatedroles";
import languages from "../data/languages.json"
import { useEffect } from "react";
import { onScroll, createTimer } from 'animejs';
import debug from "./snippets/debug";
import roles from "./snippets/roles";
import { useLanguage } from "./LanguageContext";
import { CodeWindow } from "./CodeWindow";

const ROLE_FILES: Record<string, string> = {
  Python: 'about.py',
  Java: 'About.java',
  JavaScript: 'about.js',
  'C#': 'About.cs',
};

const DEBUG_FILES: Record<string, string> = {
  Python: 'text_box.py',
  Java: 'TextBox.java',
  JavaScript: 'textBox.js',
  'C#': 'TextBox.cs',
};

const headingClass = "text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white";

export function About() {
  const { selLanguage, setLanguage } = useLanguage()
  useEffect(() => {
    const fetchWakaTimeData = async () => {
      let text = 1088 // last manual check (November 2026)
      try {
        const response = await fetch('https://wakatime.com/share/@f5440af9-4d28-4155-bed1-4eae0071b2fc/32b5b5a7-a9d4-45d0-895d-7eda3a0bf579.json');
        const json = await response.json();
        // Use raw seconds: the human-readable total ("1,088 hrs 45 mins") has a
        // thousands comma that parseFloat stops at, which turned 1,088 into 1.
        const seconds = Number(json.data.grand_total.total_seconds_including_other_language);
        if (Number.isFinite(seconds) && seconds > 0) text = Math.floor(seconds / 3600);
      } catch (err) {
        console.error("Failed to fetch WakaTime data:", err);

      }

      const scrollTrigger = document.querySelector('.scroll-section') as HTMLElement;
      const $timer = document.querySelector('.timer') as HTMLElement;

      if (!scrollTrigger || !$timer) return;

      createTimer({
        duration: text,
        alternate: false,
        loop: false,
        playbackRate: text / 1500,
        onUpdate: self => {
          $timer.textContent = Math.round(self.iterationCurrentTime).toLocaleString('en-US');
        },
        autoplay: onScroll({
          target: scrollTrigger
        })
      });
    }
    fetchWakaTimeData();
  }, []);
  return (
    <section id="about" className="py-16 md:py-24">
      <article className="flex flex-col md:flex-row md:items-center justify-between gap-10">
        <div>
          <h2 className={headingClass}>I am a...</h2>
          <AnimatedRoles />
        </div>
        <CodeWindow
          filename={ROLE_FILES[selLanguage] ?? 'about.py'}
          className="hidden md:block md:w-[460px] lg:w-[500px] shrink-0"
          codeClassName="md:text-xs xl:text-sm"
          scroll={false}
        >
          {(roles[selLanguage] || roles['Python'])(<RoleType key="stable-typewriter" />)}
        </CodeWindow>
      </article>

      <article className="mt-20 md:mt-28">
        <h2 className={headingClass}>I love what I do.</h2>
        <p className="mt-6 max-w-[68ch] text-lg md:text-xl leading-relaxed text-zinc-700 dark:text-zinc-300 [&_b]:font-semibold [&_b]:text-zinc-900 dark:[&_b]:text-white">Since I was a kid, some of my favorite things have been <b>computers, problem-solving, and creating</b>. It was no surprise that when I found out my high school offered block-coding and robotics classes as electives, I jumped at the chance to take them. These two classes were probably my favorite I took throughout my time in high school, and I felt I excelled at them. I loved everything from the <b>logic</b> to the <b>debugging</b> to the point that I knew <b>creating efficient, effective, and user-friendly software</b> would be what I aimed to do in my career. Years later, I feel very lucky to be able to work towards earning my bachelor's degree in computer science at Oregon State University. Here, I have been able to further my knowledge on both applied and foundational levels through classes like <b>Data Structures, Analysis of Algorithms, and Software Engineering</b>. I've also dedicated myself to improving my skills in this path through things like my internship at Kimley-Horn, participating in hackathons, and creating various side projects like this portfolio site you're currently reading. </p>
      </article>

      <article className="scroll-section mt-20 md:mt-28">
        <h2 className="text-center text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-zinc-900 dark:text-white">
          <span className="block">
            <span className="timer tabular-nums text-accent-700 dark:text-accent-400">0</span>+ hours*{' '}
            <span className="hidden md:inline">coding<DebugType /> and testing</span>
            <span className="md:hidden">coding, debugging, and testing</span>
          </span>
          <span className="block text-zinc-500 dark:text-zinc-400">with various languages, especially...</span>
        </h2>
        <p className="mt-3 text-center text-sm md:text-base text-zinc-500 dark:text-zinc-400">
          *since November 2024, tracked with{' '}
          <a
            href="https://wakatime.com/@f5440af9-4d28-4155-bed1-4eae0071b2fc"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline decoration-zinc-300 dark:decoration-zinc-600 underline-offset-4 hover:text-accent-700 dark:hover:text-accent-400 hover:decoration-current transition-colors">WakaTime</a>
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-[30rem_minmax(0,1fr)] lg:gap-12 items-start max-w-6xl mx-auto">
          <div>
            <p id="language-picker-label" className="mb-4 text-base md:text-lg text-zinc-600 dark:text-zinc-400">
              Pick a language and every code sample on this page switches to it.
            </p>
            <div role="group" aria-labelledby="language-picker-label" className="grid grid-cols-2 gap-4">
              {languages.languages.map((lang) => {
                const selected = selLanguage === lang.name;
                return (
                  <button
                    key={lang.name}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setLanguage(lang.name)}
                    className={`flex flex-col sm:flex-row items-center gap-3 sm:gap-4 rounded-xl border-2 px-4 py-5 sm:px-5 sm:py-6 text-lg sm:text-xl font-bold cursor-pointer transition-colors ${selected
                      ? 'border-accent-500 bg-accent-50 text-zinc-900 dark:border-accent-400 dark:bg-accent-400/10 dark:text-white'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600'}`}
                  >
                    <img src={lang.icon} alt="" className="size-12 sm:size-14 shrink-0" />
                    <span>{lang.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <CodeWindow
            filename={DEBUG_FILES[selLanguage] ?? 'TextBox.java'}
            className="min-w-0"
            codeClassName="text-xs md:text-sm xl:text-base"
          >
            {debug[selLanguage] || debug['Java']}
          </CodeWindow>
        </div>
      </article>
    </section>
  )
}
