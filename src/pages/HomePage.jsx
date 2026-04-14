import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  ArrowRight, 
  ChevronDown
} from 'lucide-react';
import NCBALogo from '../assets/images/logoIcon.png';

export const HomePage = ({ onNavigateToCalculator }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const pageShell = 'mx-auto w-full max-w-350';

  // Smooth Scroll Helper
  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for fixed header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  };

  const processSteps = [
    {
      number: '01',
      title: 'Register Account',
      description: 'Create your account and provide basic information to get started with your mortgage journey.'
    },
    {
      number: '02',
      title: 'Complete Financial Profile',
      description: 'Fill in your income, obligations, and property preferences for accurate assessment.'
    },
    {
      number: '03',
      title: 'Get Instant Prequalification',
      description: 'Receive immediate affordability assessment and explore mortgage options that suit your needs.'
    }
  ];

  const faqs = [
    {
      question: "What is mortgage prequalification?",
      answer: "Prequalification is a preliminary assessment of your loan eligibility based on your financial information. It's quick, non-binding, and gives you an estimate of how much you can borrow."
    },
    {
      question: "How does the prequalification process work?",
      answer: "Simply fill in your financial information including income, existing obligations, and preferred loan tenor. Our system instantly calculates your affordability."
    },
    {
      question: "Is my information secure?",
      answer: "Yes, we use NCBA-grade bank-level encryption, multi-factor authentication, and comply with all financial industry security standards."
    }
  ];

  // Spacer Component
  const SectionSpacer = () => (
    <div className="h-4 w-full sm:h-5 lg:h-6" aria-hidden="true"></div>
  );

  return (
    <div className="min-h-screen w-full bg-gray-100 px-4 pb-4 font-sans text-ncb-text selection:bg-ncb-blue selection:text-white sm:px-5 sm:pb-5 lg:px-6 lg:pb-6">
      
      {/* --- HEADER - Navigation items on the left --- */}
      <header className="sticky top-0 z-50 rounded-[28px] border border-ncb-divider bg-white/90 backdrop-blur-md shadow-[0_18px_30px_-24px_rgba(15,23,42,0.28)]">
        <div className={pageShell}>
          <div className="flex items-center justify-between gap-6 px-5 py-3 sm:px-6 lg:px-7">
            {/* Logo on the left */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={(e) => scrollToSection(e, 'hero')}>
              <img 
                src={NCBALogo} 
                alt="NCBA Logo" 
                className="h-8 w-auto object-contain"
              />
              <span className="text-base font-bold tracking-tighter text-ncb-heading">NCBA</span>
            </div>

            {/* Desktop Navigation - All items including Get Started on the left */}
            <div className="hidden lg:flex items-center gap-6 ml-8">
              <button
                onClick={onNavigateToCalculator}
                className="inline-flex items-center gap-2 px-5 py-2 text-[12px] font-bold uppercase tracking-widest text-ncb-heading  hover:text-blue-400 transition-all duration-300"
              >
                Get Started
                <ArrowRight size={14} />
              </button>
              <a 
                href="#hero" 
                onClick={(e) => scrollToSection(e, 'hero')} 
                className="text-[12px] font-bold uppercase tracking-widest text-ncb-heading hover:text-blue-400 transition-colors"
              >
                Home
              </a>
              <a 
                href="#about" 
                onClick={(e) => scrollToSection(e, 'about')} 
                className="text-[12px] font-bold uppercase tracking-widest text-ncb-heading hover:text-blue-400 transition-colors"
              >
                About
              </a>
              <a 
                href="#faqs" 
                onClick={(e) => scrollToSection(e, 'faqs')} 
                className="text-[12px] font-bold uppercase tracking-widest text-ncb-heading hover:text-blue-400 transition-colors"
              >
                FAQs
              </a>
            </div>

            {/* Empty div for spacing on the right (mobile menu button will go here on mobile) */}
            <div className="lg:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="p-2 text-ncb-heading"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-ncb-divider py-4 px-4 sm:px-5">
            <div className="flex flex-col gap-3">
              <button
                onClick={onNavigateToCalculator}
                className="w-full py-2.5 text-[12px] font-bold uppercase tracking-widest text-ncb-heading hover:text-blue-400 transition-all flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight size={14} />
              </button>
              <a 
                href="#hero" 
                onClick={(e) => scrollToSection(e, 'hero')} 
                className="text-[12px] font-bold uppercase tracking-widest text-ncb-heading hover:text-blue-400 py-2 text-center"
              >
                Home
              </a>
              <a 
                href="#about" 
                onClick={(e) => scrollToSection(e, 'about')} 
                className="text-[12px] font-bold uppercase tracking-widest text-ncb-heading hover:text-blue-400 py-2 text-center"
              >
                About
              </a>
              <a 
                href="#faqs" 
                onClick={(e) => scrollToSection(e, 'faqs')} 
                className="text-[12px] font-bold uppercase tracking-widest text-ncb-heading hover:text-blue-400 py-2 text-center"
              >
                FAQs
              </a>
            </div>
          </div>
        )}
      </header>

      {/* --- HERO SECTION --- */}
      <section id="hero" className="relative overflow-hidden bg-transparent pt-4 sm:pt-5">
        <div className={pageShell}>
          <div className="rounded-[28px] bg-ncb-lightbg px-5 py-8 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.18)] sm:px-7 sm:py-10 lg:px-10 lg:py-12">
            <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Content */}
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-block px-3 py-1 bg-blue-50 rounded-full">
                <span className="text-[10px] font-bold text-ncb-blue uppercase tracking-[0.2em]">
                  Mortgage Prequalification
                </span>
              </div>
              
              {/* Main Heading */}
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tighter text-ncb-heading">
                Seamless <br />
                <span className="text-blue-400">Mortgage</span> <br />
                Solutions.
              </h1>
              
              {/* Description */}
              <p className="text-lg text-ncb-text leading-relaxed max-w-md font-medium">
                Want to find a home? We are ready to help you find one that suits your lifestyle and needs.
              </p>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="aspect-4/5 rounded-2xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] transform rotate-1">
                <img 
                  src="/src/assets/images/m4.png" 
                  alt="Modern Architecture" 
                  className="w-full h-full object-cover scale-105"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl -z-10" />
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Spacer after Hero */}
      <SectionSpacer />

      {/* --- HOW IT WORKS SECTION --- */}
      <section id="about" className="bg-transparent">
        <div className={pageShell}>
          <div className="rounded-[28px] bg-white px-5 py-8 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.12)] sm:px-7 sm:py-10 lg:px-10 lg:py-12">
          {/* Section Header */}
          <div className="mb-12 flex flex-col items-center gap-4 text-center">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center justify-center gap-3">
                <div className="w-10 h-0.5 bg-blue-600" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600">Process</span>
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold tracking-tighter text-ncb-heading">
                How It Works
              </h2>
            </div>
            <p className="max-w-2xl text-base font-medium leading-relaxed text-ncb-text">
              Move through the mortgage journey in a clear order, with each step focused on one action at a time.
            </p>
          </div>

          {/* Steps Flow */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center md:gap-4 lg:gap-6">
            {processSteps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="group relative min-h-48 overflow-hidden rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">
                  <div className="flex min-h-36 flex-col items-center justify-center">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-lg font-bold text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                      {index + 1}
                    </span>
                    <h3 className="mt-4 text-lg font-bold tracking-tight text-ncb-heading transition-all duration-300 group-hover:text-blue-700">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-56 text-xs leading-relaxed text-ncb-text opacity-0 transition-all duration-300 group-hover:opacity-100">
                      {step.description}
                    </p>
                  </div>
                </div>

                {index < processSteps.length - 1 && (
                  <div className="hidden items-center justify-center text-blue-600 md:flex" aria-hidden="true">
                    <div className="flex items-center gap-2">
                      <div className="h-px w-6 bg-blue-200 lg:w-8"></div>
                      <ArrowRight size={16} strokeWidth={2} />
                      <div className="h-px w-6 bg-blue-200 lg:w-8"></div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* Spacer after How It Works */}
      <SectionSpacer />

      {/* --- FAQ SECTION --- */}
      <section id="faqs" className="bg-transparent">
        <div className={pageShell}>
          <div className="grid grid-cols-1 gap-10 rounded-[28px] bg-ncb-lightbg px-5 py-8 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.14)] sm:px-7 sm:py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-12 lg:px-10 lg:py-12">
            {/* Left Column */}
            <div className="max-w-xl">
              <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-blue-600">
                Frequently Asked Questions
              </span>
              <h2 className="mt-5 text-3xl font-bold tracking-tighter text-ncb-heading lg:text-5xl">
                Frequently asked
                <span className="block text-blue-600">questions</span>
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-ncb-text lg:text-base">
                Find direct answers about the mortgage prequalification flow, what information is required, and how the assessment works.
              </p>
            </div>

            {/* Right Column - FAQ Cards */}
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`overflow-hidden rounded-xl border bg-white transition-all duration-300 ${
                    openFaq === index
                      ? 'border-blue-300 shadow-sm'
                      : 'border-gray-200 shadow-sm hover:border-gray-300'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="flex w-full items-start justify-between gap-3 p-5 text-left"
                  >
                    <div className="pr-2">
                      <h3 className="text-sm font-semibold leading-6 text-ncb-heading sm:text-base">
                        {faq.question}
                      </h3>
                      {openFaq === index && (
                        <p className="mt-3 text-xs leading-6 text-ncb-text sm:text-sm">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                    <div className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      openFaq === index ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
                    }`}>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Spacer after FAQ */}
      <SectionSpacer />

      {/* --- FOOTER --- */}
      <footer className="bg-transparent">
        <div className={pageShell}>
          <div className="rounded-[28px] bg-white px-5 py-8 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.1)] sm:px-7 sm:py-10 lg:px-10 lg:py-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-ncb-divider pt-10">
            {/* Logo and Brand */}
            <div className="flex items-center gap-2">
              <img 
                src={NCBALogo} 
                alt="NCBA Logo" 
                className="h-7 w-auto object-contain"
              />
              <span className="text-xs font-bold uppercase tracking-widest text-ncb-heading">
                NCBA Mortgage
              </span>
            </div>
            
            {/* Copyright */}
            <p className="text-[10px] font-bold text-ncb-text uppercase tracking-widest">
              © {new Date().getFullYear()} All Rights Reserved.
            </p>
            
            {/* Footer Links */}
            <div className="flex gap-6">
              <a 
                href="#" 
                className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors"
              >
                Privacy
              </a>
              <a 
                href="#" 
                className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors"
              >
                Terms
              </a>
            </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;