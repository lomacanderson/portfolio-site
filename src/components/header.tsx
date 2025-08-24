import { HashLink as Link } from 'react-router-hash-link';
export function Header() {
    return (
<header className="hidden md:flex items-center md:sticky top-0 z-1 justify-between p-4 bg-gray-100 opacity-95 shadow px-10 md:px-15 lg:px-25">
    <h1 className="text-xl font-bold"><Link to="#home">Logan Anderson</Link></h1>
    <nav className="flex gap-3 md:gap-5 pr-14">
                <Link to="/#home">Home </Link>
                <Link to="/#about">About </Link>
                {/* Uncomment these sections once made
                <Link to="/#experience">Experience </Link> 
                <Link to="/#projects">Projects </Link>
                <Link to="/#contact">Contact </Link>
                <Link to="/#resume">Resume </Link>*/}
            </nav>
</header>
    )
}