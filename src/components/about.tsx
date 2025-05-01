import Type from "./type";
import AnimatedRoles from "./animatedroles";
import { useEffect } from "react";
import { onScroll, createTimer } from 'animejs';  
export function About() {
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
        <section id="About">
            <article className="px-25 flex flex-col md:flex-row items-center justify-between">
                <div>
                    <h3 className="text-5xl font-bold">I am a...</h3>
                    <AnimatedRoles/>
                </div>
                <pre className="bg-gray-900 text-white font-mono p-4 rounded text-lg w-fit">
                    <code>
                        <span className="text-green-400">from</span>{' '}
                        <span className="text-blue-400">life</span>{' '}
                        <span className="text-green-400">import</span>{' '}
                        <span>current_roles</span>
                        <span className="invisible inline-block">                       </span>
                        <br />
                        <span className="text-blue-400">role</span>
                        <span> = </span> 
                        <span className="text-pink-400">
                            '<span className="inline-block"><Type/></span>'
                            </span>
                        <br />
                        <span>current_roles.</span>
                        <span className="text-yellow-400">append</span>(<span className="text-blue-400">role</span>)
                        <br />
                        <span className="text-green-400">print</span>
                        <span>(current_roles)</span>
                    </code>
                </pre>
            </article>
            <article className="px-25 py-10">
                <h3 className="text-5xl font-bold py-5">I love what I do.</h3>
                <p className = "text-2xl">Since I was a kid, some of my favorite things have been computers, problem-solving, and creating. It was no surprise that when I found out my high school offered block-coding and robotics classes as electives, I jumped at the chance to take them. These two classes were probably my favorite I took throughout my time in high school, and I felt I excelled at them. I loved everything from the logic to the debugging to the point that I knew creating efficient, effective, and user-friendly software would be what I aimed to do in my career. Years later, I feel very lucky to be able to work towards earning my bachelor's degree in computer science at Oregon State University. Here, I have been able to further my knowledge on both applied and foundational levels through classes like Data Structures, Analysis of Algorithms, and Software Engineering. I've also dedicated myself to improving my skills in this path through things like my internship at Kimley-Horn, participating in hackathons, and creating various side projects like this portfolio site you're currently reading. </p>
            </article>
            <article className="scroll-section padded p-25">
                <div className="scroll-container">
                    <pre className="flex justify-center text-6xl font-bold">
                        <span className="timer value lcd">0</span>
                        <span>+ hours writing and testing code</span>
                    </pre>
                    <div className="flex justify-center">
                    <p className="text-xl">since November 2024, data tracked and retrieved with <a
                href="https://wakatime.com/@f5440af9-4d28-4155-bed1-4eae0071b2fc"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline font-bold"> WakaTime</a> </p>
                </div>
                </div>
            </article>

    </section>
    )
}
