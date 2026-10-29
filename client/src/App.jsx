import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/HomePage.jsx";
import SavedJobs from "./pages/SavedJobsPage.jsx";
import TrackJobs from "./pages/TrackJobsPage.jsx";
import About from "./pages/AboutPage.jsx";
import Contact from "./pages/ContactPage.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicyPage.jsx";
import TermsNConditions from "./pages/TermsNConditionsPage.jsx";
import Faq from "./pages/FaqPage.jsx";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/saved-jobs" element={<SavedJobs />} />
        <Route path="/track-jobs" element={<TrackJobs />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsNConditions />} />
        <Route path="/faq" element={<Faq />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
