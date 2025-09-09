import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import Toast from "../../components/ui/Toasts";
import HeroSection from "../../sections/public-sections/landing-page/HeroSection";
import InfoSection from "../../sections/public-sections/landing-page/InfoSection";
import RankingDemoSection from "../../sections/public-sections/landing-page/RankingDemoSection";
import UpsetDemoSection from "../../sections/public-sections/landing-page/UpsetDemoSection";
import ServicesSection from "../../sections/public-sections/landing-page/ServicesSection";

export default function LandingPage() {
  const { showLogoutToast } = useContext(AuthContext);

  return (
    <div>
      <HeroSection />
      <InfoSection />
      
      {/* Demo Sections Separator */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 h-1"></div>
      
      <RankingDemoSection />
      
      {/* Demo Sections Separator */}
      <div className="bg-gradient-to-r from-gray-200 to-gray-100 h-1"></div>
      
      <UpsetDemoSection />
      
      {/* Demo to Projects Separator */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 h-1"></div>
      
      <ServicesSection />
      {showLogoutToast && <Toast>Successfully logged out</Toast>}
    </div>
  );
}
