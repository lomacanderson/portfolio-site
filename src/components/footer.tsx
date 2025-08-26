import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiDevpost } from "react-icons/si";
export function Footer() {
    return (
        <footer className="p-4 px-10 md:px-15 lg:px-25 flex text-lg md:text-xl">
            <p>&copy;{new Date().getFullYear()} Logan Anderson</p>
            <div className="flex ml-auto">
                <a
                    href="https://github.com/lomacanderson"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-3 md:mx-5">
                    <FaGithub />
                </a>
                <a
                    href="https://www.linkedin.com/in/logan-m-anderson/"
                    target="_blank"
                    rel="noopener noreferrer">
                    <FaLinkedin />
                </a>
                <a
                    href="https://devpost.com/lomacanderson/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-3 md:mx-5">
                    <SiDevpost />
                </a>
            </div>
        </footer>
    )
}