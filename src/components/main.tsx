import { Home } from './home.tsx'
import { About } from './about.tsx'
import { Experience } from './experience.tsx'
import { Projects } from './projects.tsx'
import { Contact } from './contact.tsx'
export function Main() {
    return (
    <main className="px-10 md:px-15 lg:px-25">
        <Home></Home>
        <About></About>
        <Experience></Experience>
        <Projects></Projects>
        <Contact></Contact>
    </main>
    )
}
