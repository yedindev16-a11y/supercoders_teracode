import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Challenge from './components/Challenge';
import CityLab from './components/CityLab';
import ImpactObservatory from './components/ImpactObservatory';
import GreenDiscovery from './components/GreenDiscovery';
import TakeAction from './components/TakeAction';
import Footer from './components/Footer';
import { CityProvider } from './context/CityContext';

export default function Home() {
  return (
    <CityProvider>
      <div className="relative min-h-screen bg-[#0A1F0A] text-[#F5F5F0] selection:bg-[#D4FF00]/30 selection:text-white">
        {/* Fixed Sticky Header Navigation */}
        <Navigation />

        <main className="flex flex-col">
          {/* Section A: Cinematic Hero */}
          <Hero />

          {/* Section B: The Urban Challenge */}
          <Challenge />

          {/* Section C: Future City Lab Simulator (Core Feature) */}
          <CityLab />

          {/* Section D: Impact Observatory */}
          <ImpactObservatory />

          {/* Section E: Green Discovery Solutions */}
          <GreenDiscovery />

          {/* Section F: Take Action Interactive Checklist */}
          <TakeAction />
        </main>

        {/* Section G: Closing Experience & Global Footer */}
        <Footer />
      </div>
    </CityProvider>
  );
}
