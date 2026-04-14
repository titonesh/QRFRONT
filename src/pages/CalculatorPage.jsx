// import { useState } from 'react';
// import ModernLoanCalculator from '../components/ModernLoanCalculator';
// import LoanResultsDisplay from '../components/LoanResultsDisplay';
// import CallbackRequestModal from '../components/CallbackRequestModal';
// import SuccessMessage from '../components/SuccessMessage';
// import Button from '../components/Button';

// const MORTGAGE_PRODUCTS = [
//   {
//     id: 'ahf',
//     label: 'Affordable Housing Mortgage (AHF)',
//     shortLabel: 'AHF',
//     image: '/assets/AHF.png',
//     // description: 'Continue to the existing Employed or Business assessment using the affordable housing product path.',
//     audience: 'Affordable housing option',
//     highlights: [ 'Ready for future product-specific rules']
//   },
//   {
//     id: 'standard',
//     label: 'Standard Mortgage',
//     shortLabel: 'Standard Mortgage',
//     image: '/assets/standard%20mortgage.png',
//     // description: 'Continue to the same Employed or Business assessment using the standard mortgage product path.',
//     audience: 'Standard mortgage option',
//     highlights: ['Ready for future product-specific rules']
//   }
// ];

// /**
//  * CalculatorPage Component
//  * Main calculator page with form, results display, and callback modal
//  */
// export const CalculatorPage = ({ onBackHome }) => {
//   const [calculationResult, setCalculationResult] = useState(null);
//   const [showCallbackModal, setShowCallbackModal] = useState(false);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   /**
//    * Handle successful loan calculation
//    */
//   const handleCalculateSuccess = (result) => {
//     setCalculationResult(result);
//     // Scroll to results
//     setTimeout(() => {
//       document.querySelector('[data-results]')?.scrollIntoView({ behavior: 'smooth' });
//     }, 100);
//   };

//   /**
//    * Handle proceed button click
//    */
//   const handleProceed = () => {
//     // In production, this would redirect to the full application
//     setSuccessMessage({
//       title: 'Application Started',
//       message: 'Redirecting to full application. Please complete all required documents.'
//     });
//     setTimeout(() => {
//       setSuccessMessage(null);
//     }, 5000);
//   };

//   /**
//    * Handle callback request submission
//    */
//   const handleCallbackSuccess = (data) => {
//     setSuccessMessage({
//       title: 'Callback Requested',
//       message: `Thank you ${data.fullName}! Our team will contact you shortly.`
//     });
//     setTimeout(() => {
//       setSuccessMessage(null);
//     }, 5000);
//   };

//   return (
//     <div className="min-h-screen w-full bg-neutral-light flex flex-col">
//       {/* Header */}
//       <header className="bg-white shadow-sm sticky top-0 z-30 border-b-2 border-primary-light w-full">
//         <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
//           <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
//             <div className="flex items-center gap-4">
//               <Button
//                 onClick={onBackHome}
//                 variant="outline"
//                 size="sm"
//                 className="p-2!"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//               </Button>
//               <div>
//                 <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mortgage Calculator</h1>
//                 <p className="text-sm text-gray-600 hidden sm:block">
//                   {selectedProduct
//                     ? `${selectedProduct.label} selected. Continue with the borrower sector step.`
//                     : 'Choose a mortgage product first, then continue with the borrower sector step.'}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
//         <div className="max-w-7xl mx-auto w-full">
//           {!calculationResult ? (
//             // Form Section
//             <section className="py-8 lg:py-12 w-full">
//               <div className="flex justify-center w-full">
//                 <div className="w-full max-w-5xl">
//                   {!selectedProduct ? (
//                     <div className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-[0_24px_48px_-34px_rgba(15,45,73,0.28)]">
//                       <div className="border-b border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#f9fbfd_100%)] px-6 py-7 sm:px-8 sm:py-8">
//                         <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
//                           <div className="max-w-2xl">
//                             <div className="inline-flex items-center gap-2 rounded-full bg-primary-light px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
//                               {/* <span>Step 1 of 2</span>
//                               <span className="h-1 w-1 rounded-full bg-primary"></span>
//                               <span>Product Selection</span> */}
//                             </div>
//                             <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Select mortgage product</h2>
//                             <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
//                               Choose a product type to begin.
//                             </p>
//                           </div>

//                           {/* <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 lg:min-w-56">
//                             <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Next Step</p>
//                             <p className="mt-1 font-semibold text-slate-800">Borrower Sector</p>
//                             <p className="mt-1 text-xs leading-5">Employed or Business</p>
//                           </div> */}
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 sm:p-8">
//                         {MORTGAGE_PRODUCTS.map((product) => (
//                           <button
//                             key={product.id}
//                             type="button"
//                             onClick={() => setSelectedProduct(product)}
//                             className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white text-left transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_22px_38px_-28px_rgba(15,45,73,0.32)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
//                           >
//                             <div className="relative h-56 overflow-hidden bg-slate-100">
//                               <img
//                                 src={product.image}
//                                 alt={`${product.label} illustration`}
//                                 className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
//                               />
//                               <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(15,23,42,0)_0%,rgba(15,23,42,0.72)_100%)] px-6 pb-5 pt-12">
//                                 <div className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700 backdrop-blur-sm">
//                                   {product.shortLabel}
//                                 </div>
//                               </div>
//                             </div>

//                             <div className="flex flex-1 flex-col px-6 py-5 sm:px-7 sm:py-6">
//                               <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Mortgage Product</p>
//                               <h3 className="mt-2 text-xl font-bold leading-tight text-slate-900 sm:text-2xl">{product.label}</h3>
//                               <p className="mt-3 text-sm leading-6 text-slate-600">{product.description}</p>

//                               <div className="mt-4 flex flex-wrap gap-2">
//                                 <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
//                                   {product.audience}
//                                 </span>
//                                 {product.highlights.map((highlight) => (
//                                   <span key={highlight} className="rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
//                                     {highlight}
//                                   </span>
//                                 ))}
//                               </div>

//                               <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5">
//                                 <span className="text-sm font-medium text-slate-500">
//                                   Continue to sector selection
//                                 </span>
//                                 <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 group-hover:bg-primary-dark">
//                                   Select
//                                   <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                                   </svg>
//                                 </span>
//                               </div>
//                             </div>
//                           </button>
//                         ))}
//                       </div>

//                       {/* <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 text-sm text-slate-500 sm:px-8">
//                         Your selection only determines the product path shown first. The current Employed and Business calculation logic remains unchanged.
//                       </div> */}
//                     </div>
//                   ) : (
//                     <ModernLoanCalculator
//                       selectedProduct={selectedProduct}
//                       onChangeProduct={() => setSelectedProduct(null)}
//                     />
//                   )}
//                 </div>
//               </div>
//             </section>
//           ) : (
//             // Results Section
//             <section className="py-8 lg:py-12 w-full">
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 w-full">
//                 <div>
//                   <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Your Prequalification Results</h2>
//                   <p className="text-gray-600 mt-2">Based on the information you provided</p>
//                 </div>
//                 <Button
//                   onClick={() => setCalculationResult(null)}
//                   variant="secondary"
//                   size="md"
//                   className="whitespace-nowrap"
//                 >
//                   Calculate Again
//                 </Button>
//               </div>

//               <LoanResultsDisplay
//                 result={calculationResult}
//                 onProceed={handleProceed}
//                 onRequestCallback={() => setShowCallbackModal(true)}
//               />
//             </section>
//           )}
//         </div>
//       </main>

//       {/* Callback Modal */}
//       {showCallbackModal && (
//         <CallbackRequestModal
//           loanResultId={calculationResult?.loanResultId}
//           loanResponse={calculationResult}
//           loanInputs={null}
//           onClose={() => setShowCallbackModal(false)}
//           onSuccess={handleCallbackSuccess}
//         />
//       )}

//       {/* Success Message Toast */}
//       {successMessage && (
//         <SuccessMessage
//           title={successMessage.title}
//           message={successMessage.message}
//           onDismiss={() => setSuccessMessage(null)}
//         />
//       )}

//       {/* Footer */}
//       <footer className="w-full bg-white border-t-2 border-primary-light mt-8 py-8 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto w-full text-center">
//           <p className="text-gray-600">
//             This is a preliminary prequalification. Final approval requires full documentation and credit review.
//           </p>
//           <p className="text-xs text-gray-500 mt-3">
//             © 2026 Mortgage Loan Prequalification System
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default CalculatorPage;






import { useState } from 'react';
import ModernLoanCalculator from '../components/ModernLoanCalculator';
import LoanResultsDisplay from '../components/LoanResultsDisplay';
import CallbackRequestModal from '../components/CallbackRequestModal';
import SuccessMessage from '../components/SuccessMessage';
import Button from '../components/Button';

const MORTGAGE_PRODUCTS = [
  {
    id: 'ahf',
    label: 'Affordable Housing Mortgage (AHF)',
    shortLabel: 'AHF',
    image: '/assets/AHF.png',
    description: '9.5% rate for 20 years financing.',
    audience: '9.9% rate for 25 years financing.',
    highlights: []
  },
  {
    id: 'standard',
    label: 'Standard Mortgage',
    shortLabel: 'Standard Mortgage',
    image: '/assets/standard%20mortgage.png',
    description: 'Get a mortgage with competitive rates and flexible terms.',
    audience: '14.02% rate for 25 years financing.',
    highlights: ['']
  }
];

export const CalculatorPage = ({ onBackHome }) => {
  const [calculationResult, setCalculationResult] = useState(null);
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleCalculateSuccess = (result) => {
    setCalculationResult(result);
    setTimeout(() => {
      document.querySelector('[data-results]')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleProceed = () => {
    setSuccessMessage({
      title: 'Application Started',
      message: 'Redirecting to full application. Please complete all required documents.'
    });
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleCallbackSuccess = (data) => {
    setSuccessMessage({
      title: 'Callback Requested',
      message: `Thank you ${data.fullName}! Our team will contact you shortly.`
    });
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col overflow-x-hidden">
      {/* Header - Improved spacing and back button hit area */}
      <header className="bg-white shadow-sm sticky top-0 z-30 border-b border-slate-200 w-full">
        <div className="w-full px-4 py-4 sm:px-6">
          <div className="max-w-7xl mx-auto w-full flex justify-between items-center gap-3">
            <div className="flex items-center gap-3 sm:gap-6 min-w-0">
              <Button
                onClick={onBackHome}
                variant="outline"
                size="sm"
                className="rounded-full h-10 w-10 p-0 flex items-center justify-center hover:bg-slate-50 transition-colors"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Mortgage Calculator</h1>
                <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">
                  {selectedProduct
                    ? `${selectedProduct.label} selected. Continue with the borrower sector step.`
                    : 'Choose a mortgage product first, then continue with the borrower sector step.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full px-4 py-6 sm:px-6 sm:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto w-full">
          {!calculationResult ? (
            <section className="w-full">
              <div className="flex justify-center w-full">
                <div className="w-full max-w-5xl">
                  {!selectedProduct ? (
                    <div className="overflow-hidden rounded-[2rem] sm:rounded-4xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                      <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-6 sm:px-8 sm:py-10">
                        <div className="max-w-2xl text-center mx-auto">
                          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-3xl">Select mortgage product</h2>
                          <p className="mt-3 text-sm text-slate-500 sm:text-base">
                            Choose a product type to begin your prequalification.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-5 p-4 sm:gap-8 sm:p-8 md:grid-cols-2">
                        {MORTGAGE_PRODUCTS.map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => setSelectedProduct(product)}
                            className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white text-left transition-all duration-300 hover:border-primary hover:shadow-xl hover:-translate-y-1 focus:ring-2 focus:ring-primary focus:ring-offset-4"
                          >
                            {/* Image Section - Darker gradient for better text contrast */}
                            <div className="relative h-48 overflow-hidden bg-slate-100 sm:h-60">
                              <img
                                src={product.image}
                                alt={product.label}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent opacity-90" />
                              <div className="absolute inset-x-0 bottom-0 px-6 pb-5">
                                <div className="inline-flex items-center rounded-md bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-800 shadow-sm">
                                  {product.shortLabel}
                                </div>
                              </div>
                            </div>

                            {/* Content Section */}
                            <div className="flex flex-1 flex-col p-5 sm:p-7">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Mortgage Type</p>
                              <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">{product.label}</h3>
                              <p className="mt-3 text-sm leading-relaxed text-slate-500 line-clamp-2">
                                {product.description}
                              </p>

                              <div className="mt-5 flex flex-wrap gap-2">
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600 border border-slate-200">
                                  {product.audience}
                                </span>
                                {product.highlights.map((highlight) => (
                                  <span key={highlight} className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700 border border-blue-100">
                                    {highlight}
                                  </span>
                                ))}
                              </div>

                              {/* Footer Action - Higher visibility CTA */}
                              <div className="mt-auto flex flex-col items-start justify-between gap-3 border-t border-slate-100 pt-5 px-0 sm:flex-row sm:items-center">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-tight">
                                  Click to proceed
                                </span>
                                <div className="flex items-center gap-2 text-sm font-bold text-primary group-hover:translate-x-1 transition-transform">
                                  Select Product
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <ModernLoanCalculator
                      selectedProduct={selectedProduct}
                      onChangeProduct={() => setSelectedProduct(null)}
                    />
                  )}
                </div>
              </div>
            </section>
          ) : (
            <section className="py-6 sm:py-8 w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 w-full">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Your Prequalification Results</h2>
                  <p className="text-sm sm:text-base text-slate-500 mt-2">Based on the information you provided for {selectedProduct?.label}.</p>
                </div>
                <Button
                  onClick={() => setCalculationResult(null)}
                  variant="secondary"
                  size="md"
                  className="w-full sm:w-auto"
                >
                  Calculate Again
                </Button>
              </div>

              <LoanResultsDisplay
                result={calculationResult}
                onProceed={handleProceed}
                onRequestCallback={() => setShowCallbackModal(true)}
              />
            </section>
          )}
        </div>
      </main>

      {/* Modals and Toasts */}
      {showCallbackModal && (
        <CallbackRequestModal
          loanResultId={calculationResult?.loanResultId}
          loanResponse={calculationResult}
          onClose={() => setShowCallbackModal(false)}
          onSuccess={handleCallbackSuccess}
        />
      )}

      {successMessage && (
        <SuccessMessage
          title={successMessage.title}
          message={successMessage.message}
          onDismiss={() => setSuccessMessage(null)}
        />
      )}

      {/* Footer - Better spacing */}
      <footer className="w-full bg-white border-t border-slate-200 py-8 px-4 sm:px-6 sm:py-12">
        <div className="max-w-7xl mx-auto w-full text-center">
          <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
            This is a preliminary prequalification. Final approval requires full documentation and credit review.
          </p>
          <p className="text-[11px] font-medium text-slate-400 mt-6 uppercase tracking-widest">
            © 2026 Mortgage Loan Prequalification System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CalculatorPage;