import { Footer } from './components/footer.tsx'
import { Header } from './components/header.tsx'
import { Main } from './components/main.tsx'
import { ShaderBackground } from './components/ShaderBackground.tsx'

function App() {
    return (
      <>
        <ShaderBackground />
        <Header></Header>
        <Main></Main>
        <Footer></Footer>
      </>
    )
}

export default App
