import CartoonAvatar from '../assets/CartoonAvatar.svg'
import { MdLocationPin } from "react-icons/md";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiDevpost } from "react-icons/si";

export function Home() {
    return (
    <section id="home" className="pt-10 flex flex-col md:flex-row items-center justify-between">
        <div>
            <pre className="bg-gray-900 font-mono p-4 rounded lg:text-lg md:text-base text-sm w-fit">
                <code>  
                    <span className="text-[#D4D4D4]">&lt;</span>
                    <span className="text-[#569CD6]">p</span>
                    <span className="text-[#D4D4D4]">&gt;</span>
                    <span className="text-white"> Hello World! My name is... </span>
                    <span className="text-[#D4D4D4]">&lt;/</span>
                    <span className="text-[#569CD6]">p</span>
                    <span className="text-[#D4D4D4]">&gt;</span>
                </code> 
            </pre>
            <h2 className="text-7xl md:text-8xl font-bold">Logan Anderson</h2>
            <h4 className="text-2xl lg:text-3xl flex text-gray-500 items-center italic py-4"> 
                <a
                href="https://www.google.com/maps/place/Mesa,+AZ"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-600 transition">
                <MdLocationPin/>
                </a>
                Mesa, AZ
                <a
                href="https://github.com/lomacanderson"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-3 md:mx-5 hover:text-black transition">
                <FaGithub />
                </a>
                <a
                href="https://www.linkedin.com/in/logan-m-anderson/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-600 transition">
                <FaLinkedin />
                </a>
                <a
                href="https://devpost.com/lomacanderson/"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-3 md:mx-5 hover:text-cyan-900 transition">
                <SiDevpost />
                </a></h4>
            
        </div>
        <img src={CartoonAvatar} className="lg:w-110 md-w-100 w-90"/>
    </section>
    )
}
