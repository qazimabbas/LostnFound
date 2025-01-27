import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Inspiration from "../components/Inspiration";
import Features from "../components/Features";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
const LandingPage = () => {
  return (
    <div className="min-w-screen min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <main className="max-w-7xl mx-auto">
        <Hero />
        <Inspiration />
        <Features />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
