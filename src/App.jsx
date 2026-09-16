import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Skills from './components/Skills.jsx'
import CurrentlyLearning from './components/CurrentlyLearning.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import { useThemeLevel } from './hooks/useThemeLevel.js'

export default function App() {
  const theme = useThemeLevel()

  return (
    <>
      <Navbar theme={theme} />
      <main>
        <Hero />
        <div className="wrap">
          <div className="h-px bg-line-soft" />
        </div>
        <About />
        <Skills />
        <CurrentlyLearning />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
