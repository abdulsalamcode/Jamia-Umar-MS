// ✅ NAYA (uppercase Home)
import Navbar from '../components/Home/Navbar'
import Hero from '../components/Home/Hero'
import About from '../components/Home/About'
import Programs from '../components/Home/Programs'
import AdmissionForm from '../components/Home/AdmissionForm'
import AnnouncementsSection from '../components/Home/AnnouncementsSection'
import Contact from '../components/Home/Contact'
import Footer from '../components/Home/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <About />
      <Programs />
      <AdmissionForm />
      <AnnouncementsSection />
      <Contact />
      <Footer />
    </div>
  )
}