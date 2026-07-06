import { RoleType, DebugType } from "./type";
import AnimatedRoles from "./animatedroles";
import languages from "../data/languages.json"
import { useEffect } from "react";
import { onScroll, createTimer } from 'animejs';
import debug from "./snippets/debug";
import roles from "./snippets/roles";
import { useLanguage } from "./LanguageContext";

export function About() {
  const { selLanguage, setLanguage } = useLanguage()
  useEffect(() => {
    const fetchWakaTimeData = async () => {
      let text = 180 //last manual check
      try {
        const response = await fetch('https://wakatime.com/share/@f5440af9-4d28-4155-bed1-4eae0071b2fc/32b5b5a7-a9d4-45d0-895d-7eda3a0bf579.json');
        const json = await response.json();
        text = parseFloat(json.data.grand_total.human_readable_total_including_other_language.split(" ")[0]);
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
          $timer.innerHTML = self.iterationCurrentTime.toFixed(0);
        },
        autoplay: onScroll({
          target: scrollTrigger
        })
      });
    }
    fetchWakaTimeData();
  }, []);
  return (
    <section id="about">
      <article className=" flex flex-col md:flex-row items-center justify-between">
        <div>
          <h3 className="md:text-5xl text-4xl font-bold text-zinc-900 dark:text-white">I am a...</h3>
          <AnimatedRoles />
        </div>
        <pre className="bg-gray-900 text-white font-mono p-4 rounded xl:text-sm md:text-xs md:block hidden text-[10px] w-[320px] md:w-[460px] lg:w-[500px] h-fit overflow-hidden">
          {(roles[selLanguage] || roles['Python'])(<RoleType key="stable-typewriter" />)}
        </pre>
      </article>
      <article className="md:py-10">
        <h3 className="md:text-5xl text-4xl font-bold py-5 text-zinc-900 dark:text-white">I love what I do.</h3>
        <p className="text-2xl text-zinc-700 dark:text-zinc-300">Since I was a kid, some of my favorite things have been <b>computers, problem-solving, and creating</b>. It was no surprise that when I found out my high school offered block-coding and robotics classes as electives, I jumped at the chance to take them. These two classes were probably my favorite I took throughout my time in high school, and I felt I excelled at them. I loved everything from the <b>logic</b> to the <b>debugging</b> to the point that I knew <b>creating efficient, effective, and user-friendly software</b> would be what I aimed to do in my career. Years later, I feel very lucky to be able to work towards earning my bachelor's degree in computer science at Oregon State University. Here, I have been able to further my knowledge on both applied and foundational levels through classes like <b>Data Structures, Analysis of Algorithms, and Software Engineering</b>. I've also dedicated myself to improving my skills in this path through things like my internship at Kimley-Horn, participating in hackathons, and creating various side projects like this portfolio site you're currently reading. </p>
      </article>
      <article className="scroll-section padded py-10">
        <div className="scroll-container">
          <pre className="md:flex text-center justify-center text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-zinc-900 dark:text-white">
            <div className="flex justify-center">
              <span className="timer value lcd">0</span>
              <span>+ hours* </span>
            </div>
            <span className="hidden md:flex justify-center text-center text-zinc-700 dark:text-zinc-300">coding<DebugType />and testing</span>
          </pre>
          <span className="flex md:hidden text-center text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white">coding, debugging, and testing with various languages, especially...</span>
          <span className="hidden md:flex justify-center text-center text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white">with various languages, especially...</span>
          <div className="flex justify-center">
            <span className="text-center text-xs md:text-xl py-2 text-zinc-500 dark:text-zinc-400">*since November 2024, data tracked and retrieved with <a
              href="https://wakatime.com/@f5440af9-4d28-4155-bed1-4eae0071b2fc"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-teal-600 dark:hover:text-teal-400 transition font-bold"> WakaTime</a> </span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center md:gap-16 lg:gap-32">
          <div className="py-5 w-full xl:max-w-1/3">
            {languages.languages.map((lang, index) => (
              <button key={index} className={`justify-center overflow-hidden flex w-full items-center cursor-pointer border my-7 rounded-3xl gap-5 p-6 text-5xl transition-all duration-300 ${selLanguage === lang.name ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-900 dark:text-blue-200' : 'border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-850 dark:text-zinc-200'}`} onClick={() => setLanguage(lang.name)}>
                <img src={lang.icon} alt={lang.name} className="h-20" />
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
          <pre className="bg-gray-900 text-white font-mono p-4 rounded xl:text-base md:text-sm text-xs min-w-[320px] md:min-w-[450px] h-fit overflow-x-auto">
            {debug[selLanguage] || debug['Java']}
          </pre>
        </div>
      </article>
    </section>
  )
}
