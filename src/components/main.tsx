import { Routes, Route } from 'react-router-dom';
import { Home } from './home.tsx'
import { About } from './about.tsx'
import { Experience } from './experience.tsx'
import { Projects } from './projects.tsx'
import { Contact } from './contact.tsx'
import { Internship2025, InternshipCountdown } from './internship2025.tsx';
import { TbError404Off } from "react-icons/tb";
export function Main() {
    return (
        <main className="px-5 md:px-15 lg:px-25">
            <Routes>
                <Route path="/" element={
                    <>
                        <Home></Home>
                        <About></About>
                        <Experience></Experience>
                        <Projects></Projects>
                        <Contact></Contact>
                    </>
                } />
                <Route path="/internship2025" element={<Internship2025 />} />
                <Route path="/internship2026" element={<InternshipCountdown />} />
                <Route path="*" element={<span className='text-2xl md:text-4xl'><TbError404Off className='inline-block mr-3'/>404: Not Found</span>} />
            </Routes>
        </main>
    )
}
