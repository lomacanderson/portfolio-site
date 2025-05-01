import { HashLink as Link } from 'react-router-hash-link';
export function Header() {
    return (
<header className="flex items-center justify-between p-4 bg-white shadow px-25">
    <h1 className="text-xl font-bold">Logan Anderson</h1>
    <nav className="flex gap-5 pr-14">
                <Link to="#home">Home </Link>
                <Link to="#about">About </Link>
                <Link to="#experience">Experience </Link> 
                <Link to="#projects">Projects </Link>
                <Link to="#contact">Contact </Link>
                <Link to="#resume">Resume </Link>
            </nav>
</header>
    )
}