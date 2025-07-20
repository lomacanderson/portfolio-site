import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Home } from './home.tsx'
import { About } from './about.tsx'
import { Experience } from './experience.tsx'
import { Projects } from './projects.tsx'
import { Contact } from './contact.tsx'
export function Main() {
    return (
        <main className="px-10 md:px-15 lg:px-25">
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
                <Route path="/linkedin" element={<Redirect />}
                />
            </Routes>
        </main>
    )
    function Redirect() {
        useEffect(() => {
            window.location.replace('http://linkedin.com/in/logan-m-anderson');
        }, []);
        return <p className="text-5xl font-bold">Redirecting...</p>;
    }
}
