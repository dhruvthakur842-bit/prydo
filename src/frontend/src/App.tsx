import { useState } from "react";
import AboutSection from "./components/AboutSection";
import AdminPanel from "./components/AdminPanel";
import AvatarSection from "./components/AvatarSection";
import ChatWidget from "./components/ChatWidget";
import CheckMyMint from "./components/CheckMyMint";
import DAOGovernanceModal from "./components/DAOGovernanceModal";
import DecentralizedStoragePanel from "./components/DecentralizedStoragePanel";
import EcosystemSection from "./components/EcosystemSection";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import IDTiersSection from "./components/IDTiersSection";
import MintSection from "./components/MintSection";
import MintStatusChecker from "./components/MintStatusChecker";
import NFTDisclaimerModal from "./components/NFTDisclaimerModal";
import NavBar from "./components/NavBar";
import PrivacyPolicyModal from "./components/PrivacyPolicyModal";
import ProfilePanel from "./components/ProfilePanel";
import PrydoIDCardShowcase from "./components/PrydoIDCardShowcase";
import RoadmapSection from "./components/RoadmapSection";
import TechStackSection from "./components/TechStackSection";
import TermsModal from "./components/TermsModal";
import WalletModal from "./components/WalletModal";
import WhitepaperSection from "./components/WhitepaperSection";
import { WalletProvider } from "./context/WalletContext";

function AppInner() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [nftDisclaimerOpen, setNftDisclaimerOpen] = useState(false);
  const [daoGovernanceOpen, setDaoGovernanceOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background font-body overflow-x-hidden">
      {/* Ambient background gradient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #8B5CF6, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #FF4FD8, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #22D3EE, transparent 70%)",
          }}
        />
      </div>
      <div className="relative z-10">
        <NavBar />

        <main>
          <HeroSection />
          <IDTiersSection />
          <AboutSection />
          <MintSection />
          <CheckMyMint />
          <AvatarSection />
          <PrydoIDCardShowcase />
          <EcosystemSection />
          <TechStackSection />
          <DecentralizedStoragePanel />
          <WhitepaperSection />
          <RoadmapSection />
          <FAQSection />
        </main>
        <Footer
          onOpenPrivacyPolicy={() => setPrivacyOpen(true)}
          onOpenTerms={() => setTermsOpen(true)}
          onOpenNFTDisclaimer={() => setNftDisclaimerOpen(true)}
          onOpenDAOGovernance={() => setDaoGovernanceOpen(true)}
        />
      </div>
      <WalletModal />
      <ProfilePanel />
      <PrivacyPolicyModal
        open={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
      />
      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
      <NFTDisclaimerModal
        open={nftDisclaimerOpen}
        onClose={() => setNftDisclaimerOpen(false)}
      />
      <DAOGovernanceModal
        open={daoGovernanceOpen}
        onClose={() => setDaoGovernanceOpen(false)}
      />
      <ChatWidget />
    </div>
  );
}

export default function App() {
  const isAdmin = window.location.pathname === "/admin";

  if (isAdmin) {
    return (
      <WalletProvider>
        <MintStatusChecker />
        <AdminPanel />
      </WalletProvider>
    );
  }

  return (
    <WalletProvider>
      <MintStatusChecker />
      <AppInner />
    </WalletProvider>
  );
}
