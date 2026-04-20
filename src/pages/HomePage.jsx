import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  X, 
  ArrowRight, 
  ChevronDown,
  QrCode,
  Download,
  Printer,
  X as XIcon
} from 'lucide-react';
import QRCode from 'qrcode';
import NCBALogo from '../assets/images/logoIcon.png';

export const HomePage = ({ onNavigateToCalculator }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const qrCanvasRef = useRef(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  const pageShell = 'mx-auto w-full max-w-350';
  
  const QR_URL = import.meta.env.VITE_QR_URL || 'http://localhost:3001/#calculator';

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

  // Generate QR code when modal opens
  useEffect(() => {
    if (showQRModal && qrCanvasRef.current && !qrGenerated) {
      QRCode.toCanvas(
        qrCanvasRef.current,
        QR_URL,
        {
          width: 300,
          margin: 2,
          color: {
            dark: '#1f6e8c',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'H',
        },
        (error) => {
          if (error) {
            console.error('QR Code generation error:', error);
          } else {
            setQrGenerated(true);
          }
        }
      );
    }
  }, [showQRModal, QR_URL, qrGenerated]);

  // Download QR code as image
  const downloadQRCode = () => {
    if (qrCanvasRef.current) {
      const url = qrCanvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'mortgage-prequalification-qr.png';
      link.href = url;
      link.click();
    }
  };

  // Print QR code
  const printQRCode = () => {
    if (qrCanvasRef.current) {
      const image = qrCanvasRef.current.toDataURL('image/png');
      const printWindow = window.open('', '', 'width=400,height=500');
      printWindow.document.write(`
        <html>
          <head>
            <title>Mortgage Prequalification QR Code</title>
            <style>
              body { 
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                justify-content: center; 
                min-height: 100vh; 
                font-family: serif; 
              }
              img { max-width: 300px; margin: 20px 0; }
              h1 { font-size: 24px; margin-bottom: 10px; }
              p { font-size: 14px; color: #666; text-align: center; }
            </style>
          </head>
          <body>
            <h1>Mortgage Prequalification</h1>
            <p>Scan this QR code to get started</p>
            <img src="${image}" />
            <p style="margin-top: 20px; font-size: 12px;">Quick, Easy, and Transparent</p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
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
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 px-4 pb-6 font-sans text-ncb-text selection:bg-ncb-blue selection:text-white sm:px-6 sm:pb-8 lg:px-8 lg:pb-10">
      
      {/* --- HEADER - Navigation items on the left --- */}
      <header className="sticky top-0 z-50 rounded-2xl border border-ncb-divider bg-white/95 backdrop-blur-lg shadow-lg mt-3">
        <div className={pageShell}>
          <div className="flex items-center justify-between gap-8 px-6 py-4 sm:px-7 lg:px-8">
            {/* Logo on the left */}
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={(e) => scrollToSection(e, 'hero')}>
              <img 
                src={NCBALogo} 
                alt="NCBA Logo" 
                className="h-9 w-auto object-contain"
              />
              <span className="text-lg font-bold tracking-tight text-ncb-heading">NCBA</span>
            </div>

            {/* Desktop Navigation - All items including Get Started on the left */}
            <div className="hidden lg:flex items-center gap-8 ml-auto">
              <a 
                href="#hero" 
                onClick={(e) => scrollToSection(e, 'hero')} 
                className="text-sm font-semibold text-ncb-heading hover:text-blue-600 transition-colors"
              >
                Home
              </a>
              <a 
                href="#about" 
                onClick={(e) => scrollToSection(e, 'about')} 
                className="text-sm font-semibold text-ncb-heading hover:text-blue-600 transition-colors"
              >
                How It Works
              </a>
              <a 
                href="#faqs" 
                onClick={(e) => scrollToSection(e, 'faqs')} 
                className="text-sm font-semibold text-ncb-heading hover:text-blue-600 transition-colors"
              >
                FAQs
              </a>
              <button
                onClick={onNavigateToCalculator}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Get Started
                <ArrowRight size={16} />
              </button>
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
          <div className="lg:hidden bg-white border-t border-ncb-divider py-5 px-5 sm:px-6">
            <div className="flex flex-col gap-3">
              <a 
                href="#hero" 
                onClick={(e) => scrollToSection(e, 'hero')} 
                className="text-sm font-semibold text-ncb-heading hover:text-blue-600 py-2.5 text-center"
              >
                Home
              </a>
              <a 
                href="#about" 
                onClick={(e) => scrollToSection(e, 'about')} 
                className="text-sm font-semibold text-ncb-heading hover:text-blue-600 py-2.5 text-center"
              >
                How It Works
              </a>
              <a 
                href="#faqs" 
                onClick={(e) => scrollToSection(e, 'faqs')} 
                className="text-sm font-semibold text-ncb-heading hover:text-blue-600 py-2.5 text-center"
              >
                FAQs
              </a>
              <button
                onClick={onNavigateToCalculator}
                className="w-full py-3 mt-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* --- HERO SECTION --- */}
      <section id="hero" className="relative overflow-hidden bg-transparent pt-8 sm:pt-10 lg:pt-12">
        <div className={pageShell}>
          <div className="rounded-3xl bg-gradient-to-br from-ncb-lightbg to-blue-50 px-6 py-12 shadow-lg sm:px-8 sm:py-14 lg:px-12 lg:py-16">
            <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-block px-4 py-1.5 bg-blue-100 rounded-full">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  Mortgage Prequalification
                </span>
              </div>
              
              {/* Main Heading */}
              <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight tracking-tight text-ncb-heading">
                Seamless <br />
                <span className="text-blue-600">Mortgage</span> <br />
                Solutions
              </h1>
              
              {/* Description */}
              <p className="text-lg text-ncb-text leading-relaxed max-w-lg font-medium">
                Want to find a home? We are ready to help you find one that suits your lifestyle and needs.
              </p>
              
              {/* CTA Button */}
              <button
                onClick={onNavigateToCalculator}
                className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Start Prequalification
                <ArrowRight size={18} />
              </button>
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
      <section id="about" className="bg-transparent pt-8 sm:pt-10 lg:pt-12">
        <div className={pageShell}>
          <div className="rounded-3xl bg-white px-6 py-12 shadow-lg sm:px-8 sm:py-14 lg:px-12 lg:py-16">
          {/* Section Header */}
          <div className="mb-14 flex flex-col items-center gap-4 text-center">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center justify-center gap-3">
                <div className="w-10 h-0.5 bg-blue-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Process</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-ncb-heading">
                How It Works
              </h2>
            </div>
            <p className="max-w-2xl text-base font-medium leading-relaxed text-ncb-text mt-2">
              Move through the mortgage journey in a clear order, with each step focused on one action at a time.
            </p>
          </div>

          {/* Steps Flow */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center md:gap-4 lg:gap-6">
            {processSteps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="group relative min-h-52 overflow-hidden rounded-2xl border border-gray-200 bg-white p-7 text-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg">
                  <div className="flex min-h-40 flex-col items-center justify-center">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl font-bold text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                      {index + 1}
                    </span>
                    <h3 className="mt-5 text-lg font-bold tracking-tight text-ncb-heading transition-all duration-300 group-hover:text-blue-700">
                      {step.title}
                    </h3>
                    <p className="mt-4 max-w-56 text-sm leading-relaxed text-ncb-text opacity-0 transition-all duration-300 group-hover:opacity-100">
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
      <section id="faqs" className="bg-transparent pt-8 sm:pt-10 lg:pt-12">
        <div className={pageShell}>
          <div className="grid grid-cols-1 gap-12 rounded-3xl bg-gradient-to-br from-ncb-lightbg to-blue-50 px-6 py-12 shadow-lg sm:px-8 sm:py-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-14 lg:px-12 lg:py-16">
            {/* Left Column */}
            <div className="max-w-xl">
              <span className="inline-flex rounded-full bg-blue-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
                Frequently Asked Questions
              </span>
              <h2 className="mt-6 text-4xl font-bold tracking-tight text-ncb-heading lg:text-5xl">
                Frequently asked
                <span className="block text-blue-600">questions</span>
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-ncb-text">
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
                    className="flex w-full items-start justify-between gap-3 p-6 text-left"
                  >
                    <div className="pr-3">
                      <h3 className="text-base font-semibold leading-6 text-ncb-heading">
                        {faq.question}
                      </h3>
                      {openFaq === index && (
                        <p className="mt-4 text-sm leading-7 text-ncb-text">
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

      {/* --- QR CODE SECTION --- */}
      <section className="bg-transparent pt-8 sm:pt-10 lg:pt-12">
        <div className={pageShell}>
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-12 shadow-lg sm:px-8 sm:py-14 lg:px-12 lg:py-16 text-white">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm w-fit">
                  <QrCode size={20} />
                  <span className="text-sm font-semibold">Quick Access</span>
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
                  Share or Scan<br />
                  The QR Code
                </h2>
                
                <p className="text-lg text-blue-100 leading-relaxed max-w-lg font-medium">
                  Get instant access to the mortgage calculator by scanning the QR code. Perfect for sharing with friends and family or keeping on your mobile device.
                </p>
                
                <button
                  onClick={() => {
                    setShowQRModal(true);
                    setQrGenerated(false);
                  }}
                  className="inline-flex items-center gap-3 px-8 py-3.5 text-base font-bold text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <QrCode size={20} />
                  Get QR Code
                </button>
              </div>
              
              {/* Right Feature List */}
              <div className="space-y-5">
                <div className="flex gap-4 p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-white/20">
                      <QrCode size={20} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Instant Access</h3>
                    <p className="text-blue-100 text-sm mt-1">Scan to start prequalification immediately</p>
                  </div>
                </div>
                
                <div className="flex gap-4 p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-white/20">
                      <Download size={20} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Download & Print</h3>
                    <p className="text-blue-100 text-sm mt-1">Save the QR code for later use</p>
                  </div>
                </div>
                
                <div className="flex gap-4 p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-white/20">
                      <Printer size={20} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Easy Sharing</h3>
                    <p className="text-blue-100 text-sm mt-1">Share with clients and partners</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer before Footer */}
      <SectionSpacer />
      <footer className="bg-transparent pt-8 sm:pt-10 lg:pt-12">
        <div className={pageShell}>
          <div className="rounded-3xl bg-white px-6 py-12 shadow-lg sm:px-8 sm:py-12 lg:px-12 lg:py-14">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-ncb-divider pt-12">
            {/* Logo and Brand */}
            <div className="flex items-center gap-2.5">
              <img 
                src={NCBALogo} 
                alt="NCBA Logo" 
                className="h-8 w-auto object-contain"
              />
              <span className="text-sm font-bold uppercase tracking-tight text-ncb-heading">
                NCBA Mortgage
              </span>
            </div>
            
            {/* Copyright */}
            <p className="text-xs font-semibold text-ncb-text uppercase tracking-wider">
              © {new Date().getFullYear()} All Rights Reserved
            </p>
            
            {/* Footer Links */}
            <div className="flex gap-8">
              <a 
                href="#" 
                className="text-xs font-semibold uppercase tracking-wider text-blue-600 hover:text-blue-700 transition-colors"
              >
                Privacy
              </a>
              <a 
                href="#" 
                className="text-xs font-semibold uppercase tracking-wider text-blue-600 hover:text-blue-700 transition-colors"
              >
                Terms
              </a>
            </div>
            </div>
          </div>
        </div>
      </footer>

      {/* --- QR CODE MODAL --- */}
      {showQRModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <QrCode size={28} />
                <h3 className="text-2xl font-bold">QR Code</h3>
              </div>
              <button
                onClick={() => {
                  setShowQRModal(false);
                  setQrGenerated(false);
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <XIcon size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              <p className="text-center text-gray-600 mb-6 font-medium">
                Scan this QR code to access the mortgage calculator
              </p>
              
              <div className="flex justify-center mb-8 p-4 bg-gray-50 rounded-2xl">
                <canvas
                  ref={qrCanvasRef}
                  className="rounded-lg"
                />
              </div>

              <p className="text-center text-sm text-gray-500 mb-6">
                {QR_URL}
              </p>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={downloadQRCode}
                  disabled={!qrGenerated}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  <Download size={18} />
                  Download QR Code
                </button>
                
                <button
                  onClick={printQRCode}
                  disabled={!qrGenerated}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-blue-200"
                >
                  <Printer size={18} />
                  Print QR Code
                </button>
                
                <button
                  onClick={() => {
                    setShowQRModal(false);
                    setQrGenerated(false);
                  }}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;