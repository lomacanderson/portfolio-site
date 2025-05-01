import CartoonAvatar from '../assets/CartoonAvatar.svg'
import { MdLocationPin } from "react-icons/md";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiDevpost } from "react-icons/si";

export function Home() {
    return (
    <section id="Home" className="px-25 pt-10 flex flex-col md:flex-row items-center justify-between">
        <div>
            <pre className="bg-gray-900 text-green-400 font-mono p-4 rounded text-lg w-fit">
                <code>  
                    <span className="text-gray-300">&lt;</span>
                    <span className="text-purple-400">p</span>{''}
                    <span className="text-gray-300">&gt;</span>
                    <span className="text-white"> Hello World! My name is... </span>
                    <span className="text-gray-300">&lt;/</span>
                    <span className="text-purple-400">p</span>
                    <span className="text-gray-300">&gt;</span>
                </code> 
            </pre>
            <h2 className="text-8xl font-bold">Logan Anderson</h2>
            <h4 className="text-3xl flex text-gray-500 items-center italic py-4"> 
                <a
                href="https://www.google.com/maps/place/Olympia,+WA"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-600">
                <MdLocationPin/>
                </a>
            Olympia, WA
            <a
                href="https://github.com/lomacanderson"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 hover:text-black">
                <FaGithub />
                </a>
                <a
                href="https://www.linkedin.com/in/logan-m-anderson/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-600">
                <FaLinkedin />
                </a>
                <a
                href="https://devpost.com/lomacanderson/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 hover:text-cyan-900">
                <SiDevpost />
                </a></h4>
            
        </div>
        <img src={CartoonAvatar} className="w-137"/>
    </section>
    )
}
