import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CoreFeatures from "../components/CoreFeatures";
import StatsSection from "../components/StatsSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar activePage="about" />

      <main>
        <Hero />
        <CoreFeatures />
        <StatsSection />
      </main>

      <Footer />
    </div>
  );
}