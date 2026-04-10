import Button from '../components/Button';
import Accordion from '../components/Accordion';

/**
 * Home/Landing Page Component
 * QR code landing page entry point
 */
export const HomePage = ({ onNavigateToCalculator, onNavigateToQRCode }) => {
  // Feature data for maintainability
  const features = [
    {
      icon: (
        <svg className="w-10 h-10 text-primary" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v2a1 1 0 001 1h6a1 1 0 001-1v-2zM12.5 16h.01M17 15.5a.5.5 0 11-1 0 .5.5 0 011 0z" />
        </svg>
      ),
      title: "Quick Prequalification",
      description: "Get prequalified in just minutes with our streamlined process",
      bgColor: "bg-primary-light"
    },
    {
      icon: (
        <svg className="w-10 h-10 text-success" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      title: "Transparent Terms",
      description: "See all assumptions and calculations used for your results",
      bgColor: "bg-success-light"
    },
    {
      icon: (
        <svg className="w-10 h-10 text-warning" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
        </svg>
      ),
      title: "Next Steps",
      description: "Proceed immediately with the application process",
      bgColor: "bg-warning-light"
    }
  ];

  const faqs = [
    {
      question: "What is prequalification?",
      answer: "Prequalification is a preliminary assessment of your loan eligibility based on your financial information. It's quick, non-binding, and gives you an estimate of how much you can borrow."
    },
    {
      question: "How long does the process take?",
      answer: "The prequalification process takes just 5-10 minutes. Simply fill in your financial information and get instant results."
    },
    {
      question: "Is my information secure?",
      answer: "Yes, we use industry-standard encryption and follow all data protection regulations. Your information is never shared without your consent."
    },
    {
      question: "What's the difference between prequalification and approval?",
      answer: "Prequalification is an estimate. Approval requires full documentation, credit checks, and property appraisal. Final terms may vary."
    }
  ];

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section moved to top as requested */}
      <section className="w-full bg-white hero-center section-separated card-panel">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="w-full">
            <div className="w-full max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                Mortgage Prequalification <br />
                <span className="text-primary">Made Simple</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-10 leading-relaxed">
                Get instant insights into your home buying potential. No hidden calculations, no surprises—just transparency.
              </p>
              <div className="w-full flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={onNavigateToCalculator}
                  variant="primary"
                  size="lg"
                  className="shadow-lg hover:shadow-xl"
                >
                  Begin Your Prequalification
                </Button>
                <Button
                  onClick={onNavigateToQRCode}
                  variant="outline"
                  size="lg"
                  className="shadow-md hover:shadow-lg"
                >
                  Get QR Code
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stacked band: Features (top) | CTA (middle) | FAQ (bottom) - vertically ordered per design */}
      <section className="w-full bg-neutral-light py-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="flex flex-col gap-8 items-center">

            {/* Top: Features (centered) */}
            <div className="w-full flex flex-col items-center text-center py-6 bg-white card-panel section-separated">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-3 leading-tight">Why Borrowers Trust Us</h2>
              <p className="text-sm md:text-base text-gray-600 mb-4 max-w-3xl">A streamlined experience designed for borrowers like you</p>
              <div className="w-full flex justify-center mt-2 mb-4">
                <div className="flex justify-center gap-12 w-full max-w-3xl">
                {features.map((f, i) => (
                  <div key={i} className="flex flex-col items-center text-center">
                    <div className={`${f.bgColor} w-14 h-14 rounded-full flex items-center justify-center mb-2`}>
                      {f.icon}
                    </div>
                    <div className="text-sm font-semibold">{f.title}</div>
                  </div>
                ))}
                </div>
              </div>
            </div>

            {/* Middle: CTA (centered, compact) */}
            <div className="w-full cta-hero hero-center section-separated">
              <div className="w-full max-w-3xl px-4">
                <div className="inline-block bg-white/10 backdrop-blur border border-white/20 rounded-full px-3 py-1 mb-4">
                  <p className="text-xs font-semibold text-white/90">READY TO START?</p>
                </div>
                <h2 className="visible-white text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-3">Get Your Instant Prequalification</h2>
                <p className="visible-white text-sm md:text-base mb-6 max-w-3xl">Complete your prequalification in just 5 minutes and learn exactly what you can afford</p>
                <div className="flex justify-center">
                  <Button onClick={onNavigateToCalculator} variant="secondary" size="lg">Start Now</Button>
                </div>
              </div>
            </div>

            {/* Bottom: FAQ (centered) */}
            <div className="w-full flex flex-col items-center text-center py-6 section-separated">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 leading-tight">Common Questions</h2>
              <p className="text-sm text-gray-600 mb-4 max-w-3xl">Everything you need to know about prequalification</p>
              <div className="w-full max-w-3xl">
                <Accordion items={faqs} defaultOpenIndex={0} />
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* (Hero was moved above) */}

      {/* Visual Divider */}
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20"></div>

      {/* Footer */}
      <footer className="w-full bg-gray-900 py-12">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="w-full text-center">
            <p className="text-white/60 text-sm font-medium">
              © {new Date().getFullYear()} Mortgage Loan Prequalification System. All rights reserved.
            </p>
            <p className="text-white/40 text-xs mt-2">Staff? <a href="#admin-login" className="underline">Sign in</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;