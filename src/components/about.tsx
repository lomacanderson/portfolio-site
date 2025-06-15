import { RoleType, DebugType } from "./type";
import AnimatedRoles from "./animatedroles";
import languages from "../data/languages.json"
import { useEffect, useState } from "react";
import { onScroll, createTimer } from 'animejs';
export function About() {
  const [selLanguage, setLanguage] = useState('')
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
        playbackRate: 0.1,
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
          <h3 className="text-5xl font-bold">I am a...</h3>
          <AnimatedRoles />
        </div>
        <pre className="bg-gray-900 text-white font-mono p-4 rounded xl:text-lg md:text-base text-sm w-fit">
          <code>
            <span className="text-[#C586C0]">from </span>
            <span className="text-[#4EC9B0]">life </span>
            <span className="text-[#C586C0]">import </span>
            <span className="text-[#9CDCFE]">current_roles</span>
            <span className="invisible inline-block">                       </span>
            <br />
            <span className="text-[#9CDCFE]">role</span>
            <span> = </span>
            <span className="text-[#CE9178]">
              '<span className="inline-block"><RoleType /></span>'
            </span>
            <br />
            <span className="text-[#9CDCFE]">current_roles</span>
            <span>.</span>
            <span className="text-[#DCDCAA]">append</span>(<span className="text-[#9CDCFE]">role</span>)
            <br />
            <span className="text-[#DCDCAA]">print</span>
            <span>(</span>
            <span className="text-[#9CDCFE]">current_roles</span>
            <span>)</span>
          </code>
        </pre>
      </article>
      <article className=" py-10">
        <h3 className="text-5xl font-bold py-5">I love what I do.</h3>
        <p className="text-2xl">Since I was a kid, some of my favorite things have been <b>computers, problem-solving, and creating</b>. It was no surprise that when I found out my high school offered block-coding and robotics classes as electives, I jumped at the chance to take them. These two classes were probably my favorite I took throughout my time in high school, and I felt I excelled at them. I loved everything from <b>the logic to the debugging</b> to the point that I knew <b>creating efficient, effective, and user-friendly software</b> would be what I aimed to do in my career. Years later, I feel very lucky to be able to work towards earning my bachelor's degree in computer science at Oregon State University. Here, I have been able to further my knowledge on both applied and foundational levels through classes like <b>Data Structures, Analysis of Algorithms, and Software Engineering</b>. I've also dedicated myself to improving my skills in this path through things like my internship at Kimley-Horn, participating in hackathons, and creating various side projects like this portfolio site you're currently reading. </p>
      </article>
      <article className="scroll-section padded py-10">
        <div className="scroll-container">
          <pre className="md:flex justify-center text-3xl md:text-4xl lg:text-5xl font-sans font-bold">
            <div className="flex justify-center">
              <span className="timer value lcd">0</span>
              <span>+ hours* </span>
            </div>
            <span className="flex justify-center">coding<DebugType />and testing</span>
          </pre>
          <span className="flex justify-center text-3xl md:text-4xl lg:text-5xl font-bold font">with various languages, especially...</span>
          <div className="flex justify-center">
            <span className="text-xl py-2">*since November 2024, data tracked and retrieved with <a
              href="https://wakatime.com/@f5440af9-4d28-4155-bed1-4eae0071b2fc"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline transition font-bold"> WakaTime</a> </span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-16 lg:gap-32">
          <div className="py-5 w-full xl:max-w-1/3">
            {languages.languages.map((lang, index) => (
              <button key={index} className={`justify-center overflow-hidden flex w-full items-center cursor-pointer border border-black my-7 rounded-3xl gap-5 p-6 text-5xl ${selLanguage === lang.name ? 'bg-blue-100 transition' : 'hover:bg-gray-100 transition bg-white'} transition`} onClick={() => setLanguage(lang.name)}>
                <img src={lang.icon} alt={lang.name} className="w-20 h-20" />
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
          <pre className="bg-gray-900 text-white font-mono p-4 rounded xl:text-lg md:text-base text-sm">
            <code>
              <span className="text-[#569CD6]">class</span><span className="text-[#4EC9B0]"> TextBox </span>{'{\n'}
              &nbsp;&nbsp;<span className="text-[#569CD6]">public</span><span className="text-[#4EC9B0]"> String</span>[] <span className="text-[#DCDCAA]">syntaxColors</span>() {'{\n'}
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#C586C0]">return new</span> <span className="text-[#4EC9B0]">String</span>[] {'{\n'}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#FFFFFF"</span>{'\n'}
              &nbsp;&nbsp;&nbsp;&nbsp;{'}'};{'\n'}
              &nbsp;&nbsp;{'}'}{'\n'}
              {'}'}{'\n\n'}
              <span className="text-[#569CD6]">class</span><span className="text-[#4EC9B0]"> Java </span><span className="text-[#569CD6]">extends</span><span className="text-[#4EC9B0]"> TextBox </span>{'{\n'}
              &nbsp;&nbsp;@<span className="text-[#4EC9B0]">Override</span>{'\n'}
              &nbsp;&nbsp;<span className="text-[#569CD6]">public</span><span className="text-[#4EC9B0]"> String</span>[] <span className="text-[#DCDCAA]">syntaxColors</span>() {'{\n'}
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#C586C0]">return new</span> <span className="text-[#4EC9B0]">String</span>[] {'{\n'}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#FFFFFF"</span>,{'\n'}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#569CD6"</span>,{'\n'}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#C586C0"</span>,{'\n'}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#CE9178"</span>,{'\n'}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#DCDCAA"</span>,{'\n'}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#CE9178]">"#4EC9B0"</span>{'\n'}
              &nbsp;&nbsp;&nbsp;&nbsp;{'}'};{'\n'}
              &nbsp;&nbsp;{'}'}{'\n'}
              {'}'}
            </code>
          </pre>
        </div>
      </article>
    </section>
  )
}
