import Button from '../components/Button';
import Accordion from '../components/Accordion';

/**
 * Home/Landing Page Component
 * QR code landing page entry point
 */
export const HomePage = ({ onNavigateToCalculator, onNavigateToQRCode }) => {
  const trustHighlights = [
    {
      title: 'Structured Assessment',
      description: 'A guided flow that collects the right borrower details in a clear order.'
    },
    {
      title: 'Transparent Output',
      description: 'Customers see the same assumptions and affordability breakdown used in the calculator.'
    },
    {
      title: 'Customer Ready',
      description: 'Designed to feel credible, simple, and polished on both desktop and mobile.'
    }
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Choose a product path',
      description: 'Start with the mortgage type that best matches the customer journey.'
    },
    {
      step: '02',
      title: 'Enter borrower details',
      description: 'Provide income, obligations, and preferred tenor using a clear structured form.'
    },
    {
      step: '03',
      title: 'Review affordability',
      description: 'See the qualifying amount, repayment estimate, and the key assumptions applied.'
    }
  ];

  const formPreview = [
    { label: 'Borrower sector', value: 'Employed or Business' },
    { label: 'Income input', value: 'Formatted values, e.g. 100,000' },
    { label: 'Obligations', value: 'Loans, cards, and monthly commitments' },
    { label: 'Outcome', value: 'Instant affordability assessment' }
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
    <div className="min-h-screen w-full bg-stone-50 text-slate-900">
      <section className="w-full border-b border-black/5 bg-[linear-gradient(180deg,#fafaf9_0%,#f4f4f2_100%)]">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
          <div className="rounded-4xl border border-black/8 bg-white px-6 py-8 shadow-[0_24px_45px_-35px_rgba(15,23,42,0.28)] sm:px-8 sm:py-10 lg:px-10">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Mortgage Prequalification
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-5xl lg:text-6xl">
              A cleaner, more professional mortgage journey for customers.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Start with a structured product flow, capture borrower information clearly, and present qualification results in a way customers can trust.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {trustHighlights.map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-stone-50 px-4 py-4">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={onNavigateToCalculator}
                variant="outline"
                size="lg"
                className="border-slate-900 bg-slate-900 text-white hover:border-slate-800 hover:bg-slate-800"
              >
                Start Prequalification
              </Button>
              <Button
                onClick={onNavigateToQRCode}
                variant="outline"
                size="lg"
                className="border-slate-300 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-100"
              >
                Open QR Code
              </Button>
            </div>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-stone-50 px-5 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">What customers experience</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                A guided flow with quieter typography, generous spacing, rounded form surfaces, and structured content that feels credible from the first screen.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-10 sm:py-12">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_20px_40px_-36px_rgba(15,23,42,0.28)] sm:p-8 lg:p-10">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">How it works</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-4xl">Structured, calm, and easy to follow.</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                The customer-facing experience should feel organized from the first interaction, with each stage clearly separated and easy to understand.
              </p>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {processSteps.map((step) => (
                <div key={step.step} className="rounded-3xl border border-slate-200 bg-stone-50 px-5 py-5 sm:px-6 sm:py-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">{step.title}</span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-slate-500">
                      {step.step}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full pb-12">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-10">
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_20px_40px_-36px_rgba(15,23,42,0.24)] sm:p-8 lg:p-10">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Common Questions</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-4xl">Information customers usually ask for.</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                Keep the experience reassuring and transparent by answering the questions borrowers normally ask before starting.
              </p>
            </div>

            <div className="mt-8">
              <Accordion items={faqs} defaultOpenIndex={0} className="space-y-3" />
            </div>
          </div>
        </div>
      </section>

      <footer className="w-full border-t border-slate-200 bg-white py-10">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="text-center">
            <p className="text-sm font-medium text-slate-500">
              © {new Date().getFullYear()} Mortgage Loan Prequalification System. All rights reserved.
            </p>
            <p className="mt-2 text-xs text-slate-400">Staff? <a href="#admin-login" className="underline">Sign in</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;