import { Footer } from './components/footer.tsx'
import { Header } from './components/header.tsx'
import { Main } from './components/main.tsx'
import { ShaderBackground } from './components/ShaderBackground.tsx'
import { TrafficParticles } from './components/TrafficParticles.tsx'

function App() {
    return (
      <div className="relative min-h-screen overflow-x-hidden">
        {/* Hero shader — city background, top hero region only */}
        <div className="absolute top-0 left-0 w-full h-[650px] sm:h-[720px] md:h-[780px] lg:h-[840px] overflow-hidden -z-10">
          <ShaderBackground />
        </div>
        {/* Car particles — below the hero, reacting to mouse */}
        <TrafficParticles />
        <Header></Header>
        <Main></Main>
        <Footer></Footer>
      </div>
    )
}

export default App
