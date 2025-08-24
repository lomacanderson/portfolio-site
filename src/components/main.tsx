import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Home } from './home.tsx'
import { About } from './about.tsx'
import { Experience } from './experience.tsx'
import { Projects } from './projects.tsx'
import { Contact } from './contact.tsx'
import { Internship2025 } from './internship2025.tsx';
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
                <Route path="/internship2025" element={<Internship2025 />}
                />
            </Routes>
        </main>
    )
}
