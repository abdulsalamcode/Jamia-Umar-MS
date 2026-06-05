import React from 'react'
import Navbar from '../components/home/Navbar'
import Hero from '../components/home/Hero'
import About from '../components/home/About'
import Programs from '../components/home/Programs'
import AdmissionForm from '../components/home/AdmissionForm'
import AnnouncementsSection from '../components/home/AnnouncementsSection'
import Contact from '../components/home/Contact'
import Footer from '../components/home/Footer'

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