import CartoonAvatar from '../assets/CartoonAvatar.png'
import { MdLocationPin } from "react-icons/md";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiDevpost } from "react-icons/si";
import { useLanguage } from "./LanguageContext";
import helloworld from "./snippets/helloworld";

export function Home() {
    const { selLanguage } = useLanguage();
    return (
    <section id="home" className="pt-10 flex flex-col md:flex-row items-center justify-between">
        <div>
            <pre className="bg-gray-900 text-white font-mono p-4 rounded xl:text-base md:text-sm text-xs w-fit max-w-full md:max-w-[460px] lg:max-w-[500px] h-fit overflow-x-auto mb-6">
              {helloworld[selLanguage] || helloworld['Java']}
            </pre>
            <h2 className="text-7xl md:text-8xl font-bold text-zinc-900 dark:text-white">Logan Anderson</h2>
            <h4 className="text-2xl lg:text-3xl flex text-zinc-500 dark:text-zinc-400 items-center italic py-4"> 
                <a
                href="https://www.google.com/maps/place/Phoenix,+AZ"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-600 dark:hover:text-red-500 transition">
                <MdLocationPin/>
                </a>
                Phoenix, AZ
                <a
                href="https://github.com/lomacanderson"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-3 md:mx-5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition">
                <FaGithub />
                </a>
                <a
                href="https://www.linkedin.com/in/logan-m-anderson/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-sky-400 transition">
                <FaLinkedin />
                </a>
                <a
                href="https://devpost.com/lomacanderson/"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-3 md:mx-5 text-zinc-600 dark:text-zinc-400 hover:text-cyan-900 dark:hover:text-cyan-400 transition">
                <SiDevpost />
                </a></h4>
            
        </div>
        <img src={CartoonAvatar} className="lg:w-110 md-w-100 w-90"/>
    </section>
    )
}
