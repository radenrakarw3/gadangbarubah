import SignatureMenuSection from "./SignatureMenuSection";
import AboutSection from "./AboutSection";
import CateringServiceSection from "./CateringServiceSection";
import CateringInquirySection from "./CateringInquirySection";
import ContactSection from "./ContactSection";
import SectionSeam from "./SectionSeam";

/** Satu chunk untuk semua section bawah hero — dimuat saat user mulai scroll. */
export default function HomeBelowFold() {
  return (
    <>
      <SignatureMenuSection />
      <SectionSeam variant="maroon-to-cream" />
      <AboutSection />
      <SectionSeam variant="cream-to-maroon" />
      <CateringServiceSection />
      <SectionSeam variant="maroon-to-inquiry" />
      <CateringInquirySection />
      <SectionSeam variant="inquiry-to-contact" />
      <ContactSection />
    </>
  );
}
