import Navbar from "@/components/Navbar"
import HeroSection from "@/components/HeroSection"
import FeaturesSection from "@/components/FeaturesSection"
import IntegrationSection from "@/components/IntegrationSection"
import TestimonialsSection from "@/components/TestimonialsSection"
import Footer from "@/components/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <IntegrationSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  )
}
