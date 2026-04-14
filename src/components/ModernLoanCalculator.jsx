// import React, { useEffect, useState } from 'react';
// import CallbackRequestModal from './CallbackRequestModal';
// import loanService from '../services/loanService';

// export default function ModernLoanCalculator({ selectedProduct, onChangeProduct }) {
//   const [incomeSource, setIncomeSource] = useState('employed');
//   const [showCallbackModal, setShowCallbackModal] = useState(false);
//   const [hasResults, setHasResults] = useState(false);
//   const [calculated, setCalculated] = useState(false);
//   const [loanResultId, setLoanResultId] = useState(null);
//   const [loanResponse, setLoanResponse] = useState(null);
//   const [loanInputs, setLoanInputs] = useState(null);
//   const isStandardMortgage = selectedProduct?.id === 'standard';
//   const standardMortgageRate = 14.02;

//   const parseFormattedNumber = (value) => {
//     const normalized = (value || '').toString().replace(/,/g, '').trim();
//     if (normalized === '') return 0;
//     const parsed = Number.parseFloat(normalized);
//     return Number.isNaN(parsed) ? 0 : parsed;
//   };

//   const formatNumberWithCommas = (value) => {
//     const digitsOnly = (value || '').toString().replace(/\D/g, '');
//     if (!digitsOnly) return '';
//     return Number.parseInt(digitsOnly, 10).toLocaleString('en-US');
//   };

//   const formatCurrencyInput = (inputElement) => {
//     if (!inputElement) return;
//     const formatted = formatNumberWithCommas(inputElement.value);
//     inputElement.value = formatted;
//     if (document.activeElement === inputElement && typeof inputElement.setSelectionRange === 'function') {
//       inputElement.setSelectionRange(formatted.length, formatted.length);
//     }
//   };

//   useEffect(() => {
//     // Mirror the original script: DOM-driven logic for exact visual parity
//     const salaryEl = () => document.getElementById('salaryIncome');
//     const businessEl = () => document.getElementById('businessIncome');
//     const rentEl = () => document.getElementById('rentalPayment');
//     const obligationsEl = () => document.getElementById('loanObligations');
//     const tenorEl = () => document.getElementById('loanTenor');
//     const calcButton = document.getElementById('calculateTrigger');

//     const monthlyResultSpan = document.getElementById('displayMonthly');
//     const loanAmountSpan = document.getElementById('displayLoanAmount');
//     const breakdownMonthlySpan = document.getElementById('breakdownMonthly');
//     const breakdownDetailsSpan = document.getElementById('breakdownDetails');
//     const loanTenorTextSpan = document.getElementById('loanTenorText');
//     const statusBadge = document.getElementById('statusBadge');

//     function getNumericValue(inputElement) {
//       if (!inputElement) return 0;
//       let val = (inputElement.value || '').toString().trim();
//       if (val === '') return 0;
//       let num = parseFormattedNumber(val);
//       return isNaN(num) ? 0 : num;
//     }

//     function isCurrencyInput(inputElement) {
//       return !!inputElement && ['salaryIncome', 'businessIncome', 'rentalPayment', 'loanObligations'].includes(inputElement.id);
//     }

//     function computeMaxMonthlyPayment(salary, business, rental, obligations) {
//       const salaryPortion = salary * 0.6;
//       const businessPortion = business * 0.15; // 25% discount then 20% usable
//       const totalAvailable = salaryPortion + businessPortion + rental;
//       const maxMonthly = Math.max(0, totalAvailable - obligations);
//       return { maxMonthly, salaryPortion, businessPortion, totalAvailable };
//     }

//     function calculateLoanAmount(monthlyPayment, years, annualRatePercent = 5.75) {
//       if (monthlyPayment <= 0 || years <= 0) return 0;
//       const monthlyRate = annualRatePercent / 100 / 12;
//       const months = years * 12;
//       const discountFactor = (1 - Math.pow(1 + monthlyRate, -months)) / monthlyRate;
//       let loan = monthlyPayment * discountFactor;
//       if (isNaN(loan) || !isFinite(loan)) return 0;
//       return Math.max(0, loan);
//     }

//     function determineBusinessApr(monthlyTurnover) {
//       // Per pseudocode: 9.5% if <2,000,000 else 9.9%
//       if (!monthlyTurnover || isNaN(Number(monthlyTurnover))) return 9.9;
//       return Number(monthlyTurnover) < 2000000 ? 9.5 : 9.9;
//     }

//     function formatKES(value) {
//       return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
//     }

//     function refreshCalculation() {
//       const salary = getNumericValue(salaryEl());
//       const business = getNumericValue(businessEl());
//       const rental = incomeSource === 'employed' ? 0 : getNumericValue(rentEl());
//       const obligations = getNumericValue(obligationsEl());
//       const tenorElement = tenorEl();
//       let tenorYears = getNumericValue(tenorElement);

//       if (tenorYears < 1 || isNaN(tenorYears)) tenorYears = 1;
//       if (tenorYears > 25) tenorYears = 25;
//       let effectiveTenor = tenorYears;
//       if (!tenorElement || (tenorElement.value || '').toString().trim() === '') effectiveTenor = 1;

//       // If user selected Employed only, use DBR=60% and employed-specific formula per backend
//       let estimatedLoan = 0;
//       let roundedMonthly = 0;
//       let breakdownHtml = '';
//       let totalAvailable = 0;
//       let salaryPortion = 0;
//       let businessPortion = 0;
//       let maxMonthly = 0;

//       let appliedInterestRate = 5.75; // percent
//       if (incomeSource === 'employed') {
//         const netMonthlyIncome = salary;
//         const dbrCap = netMonthlyIncome * 0.60; // 60% DBR for employed
//         const availableEMI = dbrCap - obligations;
//         totalAvailable = dbrCap + rental; // for employed, total available is DBR cap (rental should be 0)

//         roundedMonthly = Math.max(0, Math.round(availableEMI));

//         if (monthlyResultSpan) monthlyResultSpan.innerText = formatKES(roundedMonthly);

//         if (availableEMI <= 0) {
//           // Does not qualify
//           estimatedLoan = 0;
//           if (loanAmountSpan) loanAmountSpan.innerText = formatKES(0);
//           const salaryDesc = `Salary (DBR 60%): ${formatKES(Math.round(netMonthlyIncome * 0.60))}`;
//           const obligationsDesc = `Existing debts: -${formatKES(obligations)}`;
//           const deficit = Math.abs(Math.round(availableEMI));
//           breakdownHtml = `${salaryDesc}<br>${obligationsDesc}<br>Deficit: ${formatKES(deficit)} → <strong>Does not qualify</strong>`;
//           if (statusBadge) {
//             statusBadge.innerHTML = "⚠️ Does not qualify — obligations exceed DBR cap";
//             statusBadge.style.background = "#fee9e6";
//             statusBadge.style.color = "#b13e3e";
//           }
//         } else {
//           // Determine interest rate based on tenor years
//           const tenorYears = Math.max(1, effectiveTenor);
//           const annualRate = isStandardMortgage ? standardMortgageRate : tenorYears <= 20 ? 9.5 : 9.9;
//           appliedInterestRate = annualRate;
//           const monthlyRate = (annualRate / 100) / 12;
//           const n = tenorYears * 12;

//           // Loan amount using annuity inversion: P = M * [(1+r)^n - 1] / [r(1+r)^n]
//           const rPlusOnePowN = Math.pow(1 + monthlyRate, n);
//           const numerator = rPlusOnePowN - 1;
//           const denominator = monthlyRate * rPlusOnePowN;
//           const loanAmount = availableEMI * (numerator / denominator);
//           estimatedLoan = Math.max(0, Math.round(loanAmount));

//           if (loanAmountSpan) loanAmountSpan.innerText = formatKES(estimatedLoan);

//           const salaryDesc = `Salary (DBR 60%): ${formatKES(Math.round(dbrCap))}`;
//           const obligationsDesc = `Existing debts: -${formatKES(obligations)}`;
//           const rentDesc = rental ? `Rent credit: +${formatKES(rental)}` : '';
//           const totalDesc = `Available EMI: ${formatKES(Math.round(availableEMI))}`;
//           breakdownHtml = `${salaryDesc}<br>${obligationsDesc}<br>${rentDesc}<br>${totalDesc} → <strong>Net monthly capacity</strong><br><small>Est. rate: ${appliedInterestRate}% APR (illustrative)</small>`;
//           if (statusBadge) {
//             statusBadge.innerHTML = "✅ Preliminary prequalification — subject to verification";
//             statusBadge.style.background = "#e0f0e8";
//             statusBadge.style.color = "#1a6e4a";
//           }
//         }
//       } else {
//         // existing blended/business logic
//         // If purely business (no salary), follow pseudocode: rental is treated as an obligation
//         if (salary <= 0 && business > 0) {
//           const PROFIT_MARGIN = 0.50;
//           const DBR_RATE = 0.40;
//           const monthlyTurnover = business;
//           const netIncome = monthlyTurnover * PROFIT_MARGIN;
//           const dbrCap = netIncome * DBR_RATE;
//           const availableEMI = dbrCap - (obligations + rental);

//           roundedMonthly = Math.max(0, Math.round(availableEMI));
//           if (monthlyResultSpan) monthlyResultSpan.innerText = formatKES(roundedMonthly);

//           if (roundedMonthly > 0 && effectiveTenor >= 1) {
//             const apr = determineBusinessApr(business);
//             appliedInterestRate = apr;
//             const monthlyRate = (apr / 100) / 12;
//             const n = effectiveTenor * 12;
//             const rPlusOnePowN = Math.pow(1 + monthlyRate, n);
//             const numerator = rPlusOnePowN - 1;
//             const denominator = monthlyRate * rPlusOnePowN;
//             const loanAmount = availableEMI * (numerator / denominator);
//             estimatedLoan = Math.max(0, Math.round(loanAmount));
//           }
//           if (loanAmountSpan) loanAmountSpan.innerText = formatKES(estimatedLoan);

//           const salaryDesc = `Business turnover (Profit 50%): ${formatKES(Math.round(netIncome))}`;
//           const obligationsDesc = `Existing debts + rent: -${formatKES(Math.round(obligations + rental))}`;
//           const totalDesc = `Available EMI: ${formatKES(Math.round(availableEMI))}`;
//           breakdownHtml = `${salaryDesc}<br>${obligationsDesc}<br>${totalDesc} → <strong>Net monthly capacity</strong><br><small>Est. rate: ${appliedInterestRate}% APR (illustrative)</small>`;
//         } else {
//           const computed = computeMaxMonthlyPayment(salary, business, rental, obligations);
//           maxMonthly = computed.maxMonthly;
//           salaryPortion = computed.salaryPortion;
//           businessPortion = computed.businessPortion;
//           totalAvailable = computed.totalAvailable;
//           roundedMonthly = Math.round(maxMonthly);
//           if (monthlyResultSpan) monthlyResultSpan.innerText = formatKES(roundedMonthly);

//           if (roundedMonthly > 0 && effectiveTenor >= 1) {
//             const apr = determineBusinessApr(business);
//             appliedInterestRate = apr;
//             estimatedLoan = calculateLoanAmount(roundedMonthly, effectiveTenor, apr);
//             estimatedLoan = Math.round(estimatedLoan);
//           }
//           if (loanAmountSpan) loanAmountSpan.innerText = formatKES(estimatedLoan);

//           if (breakdownMonthlySpan) breakdownMonthlySpan.innerText = formatKES(roundedMonthly) + ' / month';
//           const salaryDesc = `Salary (60%): ${formatKES(salaryPortion)}`;
//           const businessDesc = `Business adj. (20% after 25% discount): ${formatKES(businessPortion)}`;
//           const rentDesc = `Rent credit: +${formatKES(rental)}`;
//           const totalDesc = `Gross capacity: ${formatKES(totalAvailable)}`;
//           const obligationsDesc = `Existing debts: -${formatKES(obligations)}`;
//           // business/blended flow uses illustrative 5.75% APR unless API overrides
//           appliedInterestRate = 5.75;
//           breakdownHtml = `${salaryDesc}<br>${businessDesc}<br>${rentDesc}<br>${totalDesc}<br>${obligationsDesc} → <strong>Net monthly capacity</strong><br><small>Est. rate: ${appliedInterestRate}% APR (illustrative)</small>`;
//         }
//       }

//       if (breakdownDetailsSpan) breakdownDetailsSpan.innerHTML = breakdownHtml;

//       if (loanTenorTextSpan) {
//           const tenorValue = tenorElement && (tenorElement.value || '').toString().trim();
//           if (!tenorElement || tenorValue === '') {
//             loanTenorTextSpan.innerHTML = `No tenor entered (default 1y for estimate) · ${appliedInterestRate}% APR illustrative`;
//           } else {
//             loanTenorTextSpan.innerHTML = `${effectiveTenor} year term · Est. rate ${appliedInterestRate}% APR (illustrative) · P&I only.`;
//           }
//       }

//       if (statusBadge) {
//         if (roundedMonthly <= 0 && (salary === 0 && business === 0 && rental === 0 && obligations === 0)) {
//           statusBadge.innerHTML = "📋 Enter your financial info to see eligibility";
//           statusBadge.style.background = "#eef2f7";
//           statusBadge.style.color = "#5d7e96";
//         } else if (roundedMonthly <= 0 && (salary > 0 || business > 0 || rental > 0)) {
//           statusBadge.innerHTML = "⚠️ Low capacity — obligations exceed or equal available income";
//           statusBadge.style.background = "#fee9e6";
//           statusBadge.style.color = "#b13e3e";
//         } else if (roundedMonthly > 0) {
//           statusBadge.innerHTML = "✅ Preliminary prequalification — subject to verification";
//           statusBadge.style.background = "#e0f0e8";
//           statusBadge.style.color = "#1a6e4a";
//         } else {
//           statusBadge.innerHTML = "📋 Fill in your details";
//           statusBadge.style.background = "#eef2f7";
//           statusBadge.style.color = "#5d7e96";
//         }

//         if (obligations > totalAvailable && totalAvailable > 0 && roundedMonthly === 0) {
//           statusBadge.innerHTML = "⚠️ Existing obligations exceed housing capacity — adjust debts";
//           statusBadge.style.background = "#fff0e0";
//           statusBadge.style.color = "#b45f1b";
//         }
//       }
//     }

//     function enforceTenorConstraints() {
//       const t = tenorEl();
//       if (!t) return;
//       let val = (t.value || '').toString().trim();
//       if (val === '') return;
//       let num = parseFormattedNumber(val);
//       if (isNaN(num)) { t.value = ''; if (calculated) refreshCalculation(); return; }
//       if (num < 1) t.value = '1';
//       else if (num > 25) t.value = '25';
//       if (calculated) refreshCalculation();
//     }

//     // Use the implemented refreshCalculation function above
//     // Bind events to actual DOM elements (call getters)
//     const inputs = [salaryEl(), businessEl(), rentEl(), obligationsEl(), tenorEl()];
//     inputs.forEach(input => {
//       if (!input || typeof input.addEventListener !== 'function') return;
//       const onInput = () => {
//         try {
//           if (isCurrencyInput(input)) formatCurrencyInput(input);
//           if (!calculated) return;
//           refreshCalculation();
//         } catch (e) { console.error(e); }
//       };
//       const onBlur = () => {
//         try {
//           if (isCurrencyInput(input)) formatCurrencyInput(input);
//           if (input === tenorEl()) enforceTenorConstraints();
//           if (!calculated) return;
//           refreshCalculation();
//         } catch (e) { console.error(e); }
//       };
//       input.addEventListener('input', onInput);
//       input.addEventListener('blur', onBlur);
//       // store handlers for cleanup
//       input._onInput = onInput;
//       input._onBlur = onBlur;
//     });

//     if (calcButton) {
//       const onClick = async (e) => {
//         e.preventDefault();
//         // mark as calculated so future input changes update results
//         setCalculated(true);
//         enforceTenorConstraints();
//         // run local refresh immediately for snappy UI
//         refreshCalculation();

//         // determine whether user provided any income fields
//         const s = getNumericValue(salaryEl());
//         const b = getNumericValue(businessEl());
//         const r = incomeSource === 'employed' ? 0 : getNumericValue(rentEl());
//         const hasIncome = (s > 0) || (b > 0) || (r > 0);

//         // read displayed loan amount and monthly to include in the event detail
//         let estimated = 0;
//         try {
//           const txt = (loanAmountSpan && loanAmountSpan.innerText) ? loanAmountSpan.innerText : '';
//           estimated = Number(txt.replace(/[^0-9.-]+/g, '')) || 0;
//         } catch (err) { estimated = 0; }
//         let monthly = 0;
//         try {
//           const mtxt = (monthlyResultSpan && monthlyResultSpan.innerText) ? monthlyResultSpan.innerText : '';
//           monthly = Number(mtxt.replace(/[^0-9.-]+/g, '')) || 0;
//         } catch (err) { monthly = 0; }

//         try {
//           // Also consider displayed monthly or estimated values to decide showing callback button
//           const displayedMonthlyText = (monthlyResultSpan && monthlyResultSpan.innerText) ? monthlyResultSpan.innerText : '';
//           const displayedMonthlyNum = Number(displayedMonthlyText.replace(/[^0-9.-]+/g, '')) || 0;
//           const shouldShow = hasIncome || estimated > 0 || displayedMonthlyNum > 0;
//           setHasResults(shouldShow);
//           window.dispatchEvent(new CustomEvent('loanCalcCalculated', { detail: { estimatedLoan: estimated, monthlyPayment: monthly } }));
//         } catch (err) {}

//             // Persist calculation server-side so callbacks can reference a LoanResult
//           try {
//           const payload = {
//             productType: selectedProduct?.id || null,
//             monthlySalaryIncome: s,
//             monthlyBusinessIncome: b,
//             monthlyRentalPayments: r,
//             existingLoanObligations: getNumericValue(obligationsEl()),
//             preferredLoanTenorYears: parseInt((tenorEl() && (tenorEl().value || '').toString().trim()) || '1', 10)
//           };
//           setLoanInputs(payload);
//           const resp = await loanService.calculateLoan(payload);
//           if (resp) {
//             setLoanResponse(resp);
//             setLoanResultId(resp.loanResultId || resp.LoanResultId || null);
//             // Update displayed values from server response (more authoritative)
//             try { if (monthlyResultSpan) monthlyResultSpan.innerText = formatKES(Math.round(resp.estimatedMonthlyRepayment || resp.EstimatedMonthlyRepayment || 0)); } catch {}
//             try { if (loanAmountSpan) loanAmountSpan.innerText = formatKES(Math.round(resp.maximumLoanAmount || resp.MaximumLoanAmount || 0)); } catch {}
//             try {
//               if (loanTenorTextSpan) {
//                 const years = Math.round((resp.loanTenorMonths || resp.LoanTenorMonths || 0) / 12) || payload.preferredLoanTenorYears;
//                 // appliedInterestRate may be expressed as decimal (0.095) or percent (9.5). Normalize to percent.
//                 let apr = resp.appliedInterestRate || resp.AppliedInterestRate || resp.appliedinterestRate || resp.AppliedInterestRate || null;
//                 if (apr === null || apr === undefined) {
//                   // fall back to deterministic business rule when server does not provide APR
//                   apr = determineBusinessApr(payload.monthlyBusinessIncome || payload.monthlyBusinessIncome || 0);
//                 } else if (apr > 0 && apr < 1) apr = apr * 100;
//                 loanTenorTextSpan.innerHTML = `${years} year term · Est. rate ${apr}% APR (illustrative) · P&I only.`;
//               }
//             } catch {}
//           }
//         } catch (apiErr) {
//           // swallow; we still allow local preview, but callbacks won't be linked until successful server save
//           console.warn('Calculate API failed', apiErr);
//         }

//         calcButton.style.transform = 'scale(0.97)';
//         setTimeout(() => { calcButton.style.transform = ''; }, 150);
//       };
//       calcButton.addEventListener('click', onClick);
//       calcButton._onClick = onClick;
//     }

//     // initial clear (do not auto-run calculation until user clicks "Calculate")
//     if (salaryEl()) salaryEl().value = '';
//     if (businessEl()) businessEl().value = '';
//     if (rentEl()) rentEl().value = '';
//     if (obligationsEl()) obligationsEl().value = '';
//     if (tenorEl()) tenorEl().value = '';
//     // do not run calculation automatically on mount

//     return () => {
//       // cleanup listeners
//       inputs.forEach(input => {
//         if (!input) return;
//         if (input._onInput) input.removeEventListener('input', input._onInput);
//         if (input._onBlur) input.removeEventListener('blur', input._onBlur);
//         delete input._onInput; delete input._onBlur;
//       });
//       if (calcButton && calcButton._onClick) {
//         calcButton.removeEventListener('click', calcButton._onClick);
//         delete calcButton._onClick;
//       }
//     };
//   }, [incomeSource, calculated]);

//   useEffect(() => {
//     const handler = (ev) => {
//       const estimated = Number(ev?.detail?.estimatedLoan) || 0;
//       if (estimated > 0) setHasResults(true);
//       else setHasResults(false);
//     };
//     window.addEventListener('loanCalcCalculated', handler);
//     return () => window.removeEventListener('loanCalcCalculated', handler);
//   }, []);

//   useEffect(() => {
//     if (isStandardMortgage && incomeSource !== 'employed') {
//       setIncomeSource('employed');
//     }
//   }, [isStandardMortgage, incomeSource]);

//   // Attempt to open callback modal; ensure there's a persisted LoanResultId first
//   async function handleOpenCallback() {
//     if (loanResultId) {
//       setShowCallbackModal(true);
//       return;
//     }

//     // collect input values from DOM (mirror calculate payload)
//     const getElValue = (id) => {
//       const el = document.getElementById(id);
//       if (!el) return 0;
//       const v = (el.value || '').toString().trim();
//       const n = parseFormattedNumber(v);
//       return isNaN(n) ? 0 : n;
//     };

//     const s = getElValue('salaryIncome');
//     const b = getElValue('businessIncome');
//     const r = incomeSource === 'employed' ? 0 : getElValue('rentalPayment');
//     const payload = {
//       productType: selectedProduct?.id || null,
//       monthlySalaryIncome: s,
//       monthlyBusinessIncome: b,
//       monthlyRentalPayments: r,
//       existingLoanObligations: getElValue('loanObligations'),
//       preferredLoanTenorYears: parseInt((document.getElementById('loanTenor')?.value || '1').toString().trim(), 10) || 1
//     };
//     setLoanInputs(payload);

//     try {
//       const resp = await loanService.calculateLoan(payload);
//       if (resp) {
//         setLoanResponse(resp);
//         setLoanResultId(resp.loanResultId || resp.LoanResultId || null);
//       }
//     } catch (err) {
//       console.warn('Could not persist calculation before callback:', err);
//     }

//     setShowCallbackModal(true);
//   }

//   // When income source changes, clear the hidden input so it's not included in calculations
//   useEffect(() => {
//     const salaryEl = document.getElementById('salaryIncome');
//     const businessEl = document.getElementById('businessIncome');
//     const rentEl = document.getElementById('rentalPayment');
//     // When switching income source clear related inputs and reset calculation state
//     setCalculated(false);
//     setHasResults(false);
//     const monthlyResultSpan = document.getElementById('displayMonthly');
//     const loanAmountSpan = document.getElementById('displayLoanAmount');
//     const breakdownMonthlySpan = document.getElementById('breakdownMonthly');
//     const breakdownDetailsSpan = document.getElementById('breakdownDetails');
//     const statusBadge = document.getElementById('statusBadge');

//     if (incomeSource === 'employed') {
//       if (businessEl) businessEl.value = '';
//       if (rentEl) rentEl.value = '';
//     }
//     if (incomeSource === 'business') {
//       if (salaryEl) salaryEl.value = '';
//     }

//     // Clear displayed results when switching
//     if (monthlyResultSpan) monthlyResultSpan.innerText = 'Ksh 0';
//     if (loanAmountSpan) loanAmountSpan.innerText = 'Ksh 0';
//     if (breakdownMonthlySpan) breakdownMonthlySpan.innerText = '—';
//     if (breakdownDetailsSpan) breakdownDetailsSpan.innerText = 'Salary 60% + Business adj. + Rent credit – existing debts';
//     if (statusBadge) {
//       statusBadge.innerHTML = '📋 Fill in your details';
//       statusBadge.style.background = '#eef2f7';
//       statusBadge.style.color = '#5d7e96';
//     }
//   }, [incomeSource]);

//   // Render the exact HTML + CSS provided by the user (converted to JSX)
//   return (
//     <div>
//       <style>{`
//     * {
//       margin: 0;
//       padding: 0;
//       box-sizing: border-box;
//     }

//     body {
//       background: linear-gradient(135deg, #f0f4fa 0%, #e2eaf3 100%);
//       font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
//       padding: clamp(0.9rem, 2vw, 2rem) clamp(0.85rem, 3vw, 1.5rem);
//       color: #1a2c3e;
//       min-height: 100vh;
//       overflow-x: hidden;
//     }

//     /* Main container */
//     .loan-wrapper {
//       max-width: 1280px;
//       margin: 0 auto;
//       width: 100%;
//     }

//     /* Header section */
//     .brand-header {
//       text-align: center;
//       margin-bottom: 2.2rem;
//     }

//     .brand-header h1 {
//       font-size: clamp(1.55rem, 4vw, 2rem);
//       font-weight: 700;
//       background: linear-gradient(125deg, #1a4b63, #2c6e8f);
//       background-clip: text;
//       -webkit-background-clip: text;
//       color: transparent;
//       letter-spacing: -0.3px;
//       display: inline-flex;
//       align-items: center;
//       gap: 10px;
//     }

//     .brand-header p {
//       color: #4a6f86;
//       margin-top: 0.5rem;
//       font-weight: 500;
//       font-size: 0.95rem;
//       line-height: 1.5;
//     }

//     .product-banner {
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       gap: 1rem;
//       margin-bottom: 1.2rem;
//       padding: 1rem 1.1rem;
//       border-radius: 1.25rem;
//       background: linear-gradient(135deg, rgba(0, 174, 239, 0.1), rgba(255, 255, 255, 0.95));
//       border: 1px solid rgba(0, 174, 239, 0.16);
//     }

//     .product-step {
//       font-size: 0.72rem;
//       text-transform: uppercase;
//       letter-spacing: 0.18em;
//       color: #4a6f86;
//       font-weight: 700;
//       margin-bottom: 0.4rem;
//     }

//     .product-label {
//       display: inline-flex;
//       align-items: center;
//       flex-wrap: wrap;
//       gap: 0.5rem;
//       padding: 0.55rem 0.9rem;
//       border-radius: 999px;
//       background: rgba(255, 255, 255, 0.94);
//       color: #123542;
//       font-size: 0.95rem;
//       font-weight: 700;
//       box-shadow: 0 10px 25px -20px rgba(0, 50, 74, 0.4);
//     }

//     .product-change {
//       border: 0;
//       background: #ffffff;
//       color: #165a78;
//       border-radius: 999px;
//       padding: 0.75rem 1rem;
//       font-weight: 700;
//       cursor: pointer;
//       transition: all 0.2s ease;
//       box-shadow: 0 10px 24px -22px rgba(0, 50, 74, 0.6);
//     }

//     .product-change:hover {
//       transform: translateY(-1px);
//       background: #f4fbff;
//     }

//     /* Income source selector */
//     .income-source {
//       display:flex;
//       gap:0.6rem;
//       align-items:center;
//       flex-wrap: wrap;
//       margin-bottom:1rem;
//     }
//     .income-source label{ display:flex; gap:0.5rem; align-items:center; font-weight:600; color:#123542; font-size:0.95rem; }
//     .income-source input[type="radio"]{ accent-color:#1f6e8c; }

//     .income-source-copy {
//       margin-bottom: 0.9rem;
//     }

//     .income-source-copy p:first-child {
//       font-size: 0.72rem;
//       text-transform: uppercase;
//       letter-spacing: 0.16em;
//       color: #4a6f86;
//       font-weight: 700;
//       margin-bottom: 0.35rem;
//     }

//     .income-source-copy p:last-child {
//       color: #1a2c3e;
//       font-size: 1rem;
//       font-weight: 600;
//     }

//     /* Grid layout */
//     .form-grid {
//       display: grid;
//       grid-template-columns: repeat(2, 1fr);
//       gap: 1.8rem;
//       align-items: start;
//     }

//     /* Cards */
//     .card-panel {
//       background: rgba(255, 255, 255, 0.97);
//       backdrop-filter: blur(0px);
//       border-radius: 1.8rem;
//       box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.02);
//       overflow: hidden;
//       transition: all 0.25s ease;
//       border: 1px solid rgba(255,255,255,0.6);
//     }

//     .card-panel:hover {
//       transform: translateY(-2px);
//       box-shadow: 0 24px 40px -14px rgba(0, 0, 0, 0.15);
//     }

//     .card-title {
//       padding: 1.15rem 1.25rem 0.7rem 1.25rem;
//       font-weight: 650;
//       font-size: 1.15rem;
//       border-bottom: 2px solid #eef2f8;
//       display: flex;
//       align-items: center;
//       gap: 10px;
//       background: #ffffffcc;
//       letter-spacing: -0.2px;
//     }

//     .card-title span:first-child {
//       font-size: 1.5rem;
//     }

//     .card-body {
//       padding: 1.25rem 1.25rem 1.5rem 1.25rem;
//     }

//     /* Form styling */
//     .input-section {
//       margin-bottom: 1.8rem;
//     }

//     .label-row {
//       display: flex;
//       justify-content: space-between;
//       align-items: baseline;
//       flex-wrap: wrap;
//       gap: 0.5rem;
//       margin-bottom: 0.5rem;
//     }

//     .field-label {
//       font-weight: 600;
//       color: #1e4b61;
//       font-size: 0.9rem;
//     }

//     .badge-hint {
//       font-size: 0.7rem;
//       background: #eff3f9;
//       padding: 0.2rem 0.65rem;
//       border-radius: 30px;
//       color: #4f7e98;
//       font-weight: 500;
//     }

//     .input-wrapper {
//       width: 100%;
//     }

//     .input-field {
//       width: 100%;
//       padding: 0.85rem 1rem;
//       font-size: 1rem;
//       font-weight: 500;
//       border: 1.5px solid #e0e9f0;
//       border-radius: 1.2rem;
//       background: #ffffff;
//       transition: all 0.2s;
//       font-family: inherit;
//       color: #1f3f50;
//     }

//     .input-field:focus {
//       outline: none;
//       border-color: #3182a3;
//       box-shadow: 0 0 0 3px rgba(49, 130, 163, 0.15);
//     }

//     .input-field::placeholder {
//       color: #b9cedc;
//       font-weight: 400;
//     }

//     hr {
//       margin: 1.3rem 0;
//       border: 0;
//       height: 1px;
//       background: linear-gradient(to right, #e2ecf5, transparent);
//     }

//     /* Tenor special */
//     .tenor-note {
//       font-size: 0.7rem;
//       color: #6e8ea5;
//       margin-top: 0.5rem;
//       padding-left: 0.3rem;
//       display: flex;
//       align-items: center;
//       gap: 6px;
//     }

//     /* Results area */
//     .results-container {
//       background: linear-gradient(125deg, #ffffff 0%, #fbfeff 100%);
//     }

//     .result-block {
//       background: #f9fbfe;
//       border-radius: 1.4rem;
//       padding: 1rem 1.2rem;
//       margin-bottom: 1.2rem;
//       border: 1px solid #eef2f0;
//       transition: all 0.2s;
//     }

//     .result-block.highlight {
//       background: #eef6fc;
//       border-left: 4px solid #2c8faf;
//     }

//     .result-label {
//       font-size: 0.75rem;
//       text-transform: uppercase;
//       letter-spacing: 0.5px;
//       font-weight: 700;
//       color: #5c7f96;
//       margin-bottom: 0.3rem;
//     }

//     .result-value {
//       font-size: clamp(1.45rem, 4vw, 2rem);
//       font-weight: 800;
//       color: #12455f;
//       line-height: 1.2;
//       word-break: break-word;
//     }

//     .result-footnote {
//       font-size: 0.7rem;
//       color: #6f90a5;
//       margin-top: 0.3rem;
//     }

//     .eligibility-chip {
//       display: inline-block;
//       background: #e5f0f5;
//       padding: 0.25rem 1rem;
//       border-radius: 40px;
//       font-size: 0.75rem;
//       font-weight: 600;
//       color: #1c6e8c;
//       margin-top: 0.5rem;
//     }

//     /* CTA Button */
//     .calc-btn {
//       width: 100%;
//       background: #1f6e8c;
//       border: none;
//       padding: 0.9rem;
//       font-size: 1rem;
//       font-weight: 600;
//       color: white;
//       border-radius: 2.2rem;
//       cursor: pointer;
//       transition: all 0.2s ease;
//       margin-top: 1rem;
//       font-family: inherit;
//       box-shadow: 0 3px 8px rgba(0,0,0,0.05);
//       letter-spacing: 0.3px;
//     }

//     .calc-btn:hover {
//       background: #0e5b78;
//       transform: scale(0.98);
//       box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
//     }

//     /* Info footers */
//     .legal-note {
//       margin-top: 1.8rem;
//       font-size: 0.7rem;
//       text-align: center;
//       color: #68869b;
//       background: #eef3f9;
//       padding: 0.8rem;
//       border-radius: 1.5rem;
//       border-left: 3px solid #aacbdf;
//     }

//     .steps-row {
//       margin-top: 2rem;
//       background: #f3f7fc;
//       border-radius: 1.8rem;
//       padding: 1rem 1.2rem;
//       display: flex;
//       justify-content: space-between;
//       flex-wrap: wrap;
//       gap: 1rem;
//       font-size: 0.85rem;
//       font-weight: 500;
//       color: #235f7a;
//     }

//     @media (max-width: 780px) {
//       .form-grid {
//         grid-template-columns: 1fr;
//         gap: 1.1rem;
//       }
//       .product-banner {
//         flex-direction: column;
//         align-items: flex-start;
//         padding: 0.95rem;
//       }
//       .result-value {
//         font-size: 1.6rem;
//       }
//       .card-body {
//         padding: 1.2rem;
//       }
//       .calc-btn {
//         padding: 0.95rem;
//       }
//       .product-change {
//         width: 100%;
//         justify-content: center;
//       }
//     }

//     @media (max-width: 480px) {
//       .brand-header {
//         margin-bottom: 1.35rem;
//       }
//       .income-source label {
//         width: 100%;
//       }
//       .card-title {
//         padding: 1rem 1rem 0.6rem 1rem;
//         font-size: 1rem;
//       }
//       .card-body {
//         padding: 1rem;
//       }
//       .result-block {
//         padding: 0.9rem 1rem;
//       }
//       .legal-note {
//         padding: 0.75rem;
//       }
//     }
//   `}</style>

//       <div className="loan-wrapper">
//         <div className="brand-header">
//           <h1>🏡 Mortgage Prequalification</h1>
//           <p>Enter your financial information below to get started</p>
//         </div>

//         {selectedProduct && (
//           <div className="product-banner">
//             <div>
//               <p className="product-step">Step 2 of 2</p>
//               <div className="product-label">
//                 <span>Product</span>
//                 <span>{selectedProduct.label}</span>
//               </div>
//             </div>
//             {onChangeProduct && (
//               <button type="button" className="product-change" onClick={onChangeProduct}>
//                 Change product
//               </button>
//             )}
//           </div>
//         )}

//         <div className="income-source-copy">
//           <p>Borrower Sector</p>
//           <p>
//             {isStandardMortgage
//               ? 'Standard Mortgage is available for employed applicants only.'
//               : 'Select the income segment to continue with the existing affordability flow.'}
//           </p>
//         </div>

//         <div className="form-grid">
//           <div className="card-panel">
//             <div className="card-title"><span>📋</span> Income & Obligations</div>
//             <div className="card-body">
//               <div className="input-section">
//                 <div className="income-source" role="radiogroup" aria-label="Source of income">
//                   <label><input type="radio" name="incomeSource" value="employed" checked={incomeSource==='employed'} onChange={() => setIncomeSource('employed')} /> Employed</label>
//                   {!isStandardMortgage && (
//                     <label><input type="radio" name="incomeSource" value="business" checked={incomeSource==='business'} onChange={() => setIncomeSource('business')} /> Business</label>
//                   )}
//                 </div>

//                   {incomeSource === 'employed' && (
//                     <>
//                       <div className="label-row">
//                         <span className="field-label">💰 Monthly Net Income</span>
//                         <span className="badge-hint"></span>
//                       </div>
//                       <div className="input-wrapper">
//                         <input type="text" inputMode="numeric" id="salaryIncome" className="input-field" placeholder="e.g., 100,000" autoComplete="off" />
//                       </div>
//                     </>
//                   )}
//               </div>
//                 {incomeSource === 'business' && (
//                   <div className="input-section">
//                     <div className="label-row">
//                       <span className="field-label">📊 Monthly Business Turnover</span>
//                       <span className="badge-hint">20% after 25% discount</span>
//                     </div>
//                     <input type="text" inputMode="numeric" id="businessIncome" className="input-field" placeholder="e.g., 1,000,000" autoComplete="off" />
//                   </div>
//                 )}

//               <hr />

//               {incomeSource !== 'employed' && (
//                 <div className="input-section">
//                   <div className="label-row">
//                     <span className="field-label">💳 Credit cards limits</span>
//                     {/* <span className="badge-hint">Can contribute to affordability</span> */}
//                   </div>
//                   <input type="number" id="rentalPayment" className="input-field" placeholder="e.g., 1200" step="50" autoComplete="off" />
//                 </div>
//               )}
//               {/* Credit card and overdraft limits removed per UI requirements; treat as part of existing obligations */}

//               <div className="input-section">
//                 <div className="label-row">
//                   <span className="field-label">📉 Existing Monthly Loan Obligations</span>
//                   <span className="badge-hint">Car loans, credit cards, etc.</span>
//                 </div>
//                 <input type="text" inputMode="numeric" id="loanObligations" className="input-field" placeholder="e.g., 25,000" autoComplete="off" />
//               </div>

//               <hr />

//               <div className="input-section">
//                 <div className="label-row">
//                   <span className="field-label">⏱️ Preferred Loan Tenor (Years)</span>
//                   <span className="badge-hint">1–25 years max</span>
//                 </div>
//                 <input type="number" id="loanTenor" className="input-field" placeholder="e.g., 20" min="1" max="25" step="1" autoComplete="off" />
//                 <div className="tenor-note"><span>ⓘ</span> Enter a number between 1 and 25 (maximum 25 years)</div>
//               </div>

//               <button id="calculateTrigger" className="calc-btn">✨ Calculate eligibility ✨</button>
//             </div>
//           </div>

//           <div className="card-panel results-container">
//             <div className="card-title"><span>📈</span> Your Loan Assessment</div>
//             <div className="card-body">
//               <div className="result-block highlight">
//                 <div className="result-label">🏦 MAXIMUM MONTHLY MORTGAGE PAYMENT</div>
//                 <div className="result-value" id="displayMonthly">Ksh 0</div>
//                 <div className="result-footnote">Principal + interest (based on qualifying income)</div>
//               </div>

//               <div className="result-block">
//                 <div className="result-label">🏡 ESTIMATED LOAN AMOUNT</div>
//                 <div className="result-value" id="displayLoanAmount">Ksh 0</div>
//                 <div className="result-footnote" id="loanTenorText">Based on your selected tenor & illustrative rate</div>
//               </div>

//               <div className="result-block">
//                 <div className="result-label">📊 ELIGIBILITY BREAKDOWN</div>
//                 <div className="result-value" id="breakdownMonthly" style={{ fontSize: '1.2rem', fontWeight: 700 }}>—</div>
//                 <div className="result-footnote" id="breakdownDetails">Salary 60% + Business adj. + Rent credit – existing debts</div>
//               </div>

//               <div id="statusBadge" className="eligibility-chip">📋 Fill in your details</div>
//               {(calculated && (hasResults || loanResultId)) && (
//                 <div style={{marginTop:12}}>
//                   <button type="button" className="calc-btn" style={{background:'#ffffff', color:'#1f6e8c', border:'1px solid #cfe6ec'}} onClick={handleOpenCallback}>📞 Request callback</button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="steps-row">
//           <span>1️⃣ Enter your financial information</span>
//           <span>2️⃣ We calculate your eligibility</span>
//           <span>3️⃣ View your results instantly</span>
//           <span>📌 Max loan tenor: 25 years</span>
//         </div>

//         <div className="legal-note">⚠️ This calculation is preliminary and not a final loan offer. Subject to verification, credit approval, and underwriting. This is a preliminary assessment and not a final approval.</div>
//       {showCallbackModal && (
//         <CallbackRequestModal
//           loanResultId={loanResultId}
//           loanResponse={loanResponse}
//           loanInputs={loanInputs}
//           onClose={() => setShowCallbackModal(false)}
//           onSuccess={(d) => { setShowCallbackModal(false); }}
//         />
//       )}
//       </div>
//     </div>
//   );
// }







// // import React, { useState, useEffect } from 'react';
// // import CallbackRequestModal from './CallbackRequestModal';
// // import loanService from '../services/loanService';

// // export default function ModernLoanCalculator({ selectedProduct, onChangeProduct }) {
// //   const [incomeSource, setIncomeSource] = useState('employed');
// //   const [showCallbackModal, setShowCallbackModal] = useState(false);
// //   const [calculated, setCalculated] = useState(false);
// //   const [loanResultId, setLoanResultId] = useState(null);
// //   const [loanResponse, setLoanResponse] = useState(null);
// //   const [loanInputs, setLoanInputs] = useState(null);
// //   const [activeScenario, setActiveScenario] = useState('base');
// //   const [monthlyPayment, setMonthlyPayment] = useState(0);
// //   const [loanAmount, setLoanAmount] = useState(0);
  
// //   const isStandardMortgage = selectedProduct?.id === 'standard';
// //   const standardMortgageRate = 14.02;

// //   const scenarios = [
// //     { id: 'base', name: 'Base Scenario', rate: 5.75, color: '#0066FF' },
// //     { id: 'optimistic', name: 'Optimistic', rate: 5.25, color: '#00C853' },
// //     { id: 'conservative', name: 'Conservative', rate: 6.25, color: '#FF6B35' }
// //   ];

// //   const parseFormattedNumber = (value) => {
// //     const normalized = (value || '').toString().replace(/,/g, '').trim();
// //     if (normalized === '') return 0;
// //     const parsed = Number.parseFloat(normalized);
// //     return Number.isNaN(parsed) ? 0 : parsed;
// //   };

// //   const formatNumberWithCommas = (value) => {
// //     const digitsOnly = (value || '').toString().replace(/\D/g, '');
// //     if (!digitsOnly) return '';
// //     return Number.parseInt(digitsOnly, 10).toLocaleString('en-US');
// //   };

// //   const formatKES = (value) => {
// //     return new Intl.NumberFormat('en-KE', { 
// //       style: 'currency', 
// //       currency: 'KES', 
// //       minimumFractionDigits: 0, 
// //       maximumFractionDigits: 0 
// //     }).format(value);
// //   };

// //   const calculateLoan = (salary, business, obligations, tenorYears, rate) => {
// //     let availableEMI = 0;
    
// //     if (incomeSource === 'employed') {
// //       const dbrCap = salary * 0.60;
// //       availableEMI = Math.max(0, dbrCap - obligations);
// //     } else {
// //       const PROFIT_MARGIN = 0.50;
// //       const DBR_RATE = 0.40;
// //       const netIncome = business * PROFIT_MARGIN;
// //       const dbrCap = netIncome * DBR_RATE;
// //       availableEMI = Math.max(0, dbrCap - obligations);
// //     }
    
// //     if (availableEMI <= 0 || tenorYears < 1) return 0;
    
// //     const monthlyRate = (rate / 100) / 12;
// //     const n = tenorYears * 12;
// //     const rPlusOnePowN = Math.pow(1 + monthlyRate, n);
// //     const numerator = rPlusOnePowN - 1;
// //     const denominator = monthlyRate * rPlusOnePowN;
// //     const loanAmountCalc = availableEMI * (numerator / denominator);
    
// //     return Math.max(0, Math.round(loanAmountCalc));
// //   };

// //   const handleCalculate = async () => {
// //     const salary = parseFormattedNumber(document.getElementById('salaryIncome')?.value);
// //     const business = parseFormattedNumber(document.getElementById('businessIncome')?.value);
// //     const obligations = parseFormattedNumber(document.getElementById('loanObligations')?.value);
// //     const tenor = Math.min(25, Math.max(1, parseFormattedNumber(document.getElementById('loanTenor')?.value) || 1));
    
// //     const currentRate = scenarios.find(s => s.id === activeScenario)?.rate || 5.75;
// //     const estimatedLoan = calculateLoan(salary, business, obligations, tenor, currentRate);
    
// //     setLoanAmount(estimatedLoan);
// //     setMonthlyPayment(estimatedLoan > 0 ? Math.round(estimatedLoan * (currentRate / 100 / 12)) : 0);
// //     setCalculated(true);
    
// //     const payload = {
// //       productType: selectedProduct?.id || null,
// //       monthlySalaryIncome: salary,
// //       monthlyBusinessIncome: business,
// //       monthlyRentalPayments: 0,
// //       existingLoanObligations: obligations,
// //       preferredLoanTenorYears: tenor
// //     };
    
// //     setLoanInputs(payload);
    
// //     try {
// //       const resp = await loanService.calculateLoan(payload);
// //       if (resp) {
// //         setLoanResponse(resp);
// //         setLoanResultId(resp.loanResultId || resp.LoanResultId || null);
// //       }
// //     } catch (err) {
// //       console.warn('API error:', err);
// //     }
// //   };

// //   const handleOpenCallback = async () => {
// //     if (loanResultId) {
// //       setShowCallbackModal(true);
// //       return;
// //     }
    
// //     const salary = parseFormattedNumber(document.getElementById('salaryIncome')?.value);
// //     const business = parseFormattedNumber(document.getElementById('businessIncome')?.value);
// //     const obligations = parseFormattedNumber(document.getElementById('loanObligations')?.value);
// //     const tenor = Math.min(25, Math.max(1, parseFormattedNumber(document.getElementById('loanTenor')?.value) || 1));
    
// //     const payload = {
// //       productType: selectedProduct?.id || null,
// //       monthlySalaryIncome: salary,
// //       monthlyBusinessIncome: business,
// //       monthlyRentalPayments: 0,
// //       existingLoanObligations: obligations,
// //       preferredLoanTenorYears: tenor
// //     };
    
// //     setLoanInputs(payload);
    
// //     try {
// //       const resp = await loanService.calculateLoan(payload);
// //       if (resp) {
// //         setLoanResponse(resp);
// //         setLoanResultId(resp.loanResultId || resp.LoanResultId || null);
// //       }
// //     } catch (err) {
// //       console.warn('Could not persist calculation:', err);
// //     }
    
// //     setShowCallbackModal(true);
// //   };

// //   useEffect(() => {
// //     if (calculated) {
// //       handleCalculate();
// //     }
// //   }, [activeScenario]);

// //   return (
// //     <div>
// //       <style>{`
// //         * {
// //           margin: 0;
// //           padding: 0;
// //           box-sizing: border-box;
// //         }

// //         body {
// //           background: #F5F7FA;
// //           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
// //           color: #1A1A2E;
// //         }

// //         /* Main Container */
// //         .mortgage-container {
// //           max-width: 1200px;
// //           margin: 0 auto;
// //           padding: 20px;
// //         }

// //         /* Header */
// //         .header {
// //           margin-bottom: 32px;
// //         }

// //         .step-indicator {
// //           display: flex;
// //           gap: 8px;
// //           margin-bottom: 16px;
// //           flex-wrap: wrap;
// //         }

// //         .step {
// //           display: flex;
// //           align-items: center;
// //           gap: 8px;
// //           font-size: 14px;
// //           color: #8E8E93;
// //         }

// //         .step.active {
// //           color: #0066FF;
// //           font-weight: 600;
// //         }

// //         .step-number {
// //           width: 28px;
// //           height: 28px;
// //           border-radius: 50%;
// //           background: #E5E5EA;
// //           display: flex;
// //           align-items: center;
// //           justify-content: center;
// //           font-size: 12px;
// //           font-weight: 600;
// //         }

// //         .step.active .step-number {
// //           background: #0066FF;
// //           color: white;
// //         }

// //         .step.completed .step-number {
// //           background: #00C853;
// //           color: white;
// //         }

// //         .step-arrow {
// //           color: #C6C6C8;
// //         }

// //         .product-selector {
// //           display: flex;
// //           justify-content: space-between;
// //           align-items: center;
// //           flex-wrap: wrap;
// //           gap: 16px;
// //           margin-bottom: 24px;
// //           padding: 16px 20px;
// //           background: white;
// //           border-radius: 16px;
// //           box-shadow: 0 1px 3px rgba(0,0,0,0.05);
// //         }

// //         .product-info {
// //           display: flex;
// //           align-items: center;
// //           gap: 12px;
// //           flex-wrap: wrap;
// //         }

// //         .product-badge {
// //           padding: 6px 12px;
// //           background: #F0F7FF;
// //           border-radius: 20px;
// //           font-size: 12px;
// //           font-weight: 600;
// //           color: #0066FF;
// //         }

// //         .product-name {
// //           font-weight: 600;
// //           font-size: 16px;
// //         }

// //         .change-btn {
// //           padding: 8px 16px;
// //           background: transparent;
// //           border: 1px solid #E5E5EA;
// //           border-radius: 12px;
// //           font-size: 14px;
// //           color: #0066FF;
// //           cursor: pointer;
// //           transition: all 0.2s;
// //         }

// //         .change-btn:hover {
// //           background: #F0F7FF;
// //           border-color: #0066FF;
// //         }

// //         /* Main Grid */
// //         .main-grid {
// //           display: grid;
// //           grid-template-columns: 1fr 1fr;
// //           gap: 24px;
// //         }

// //         @media (max-width: 768px) {
// //           .main-grid {
// //             grid-template-columns: 1fr;
// //             gap: 20px;
// //           }
          
// //           .mortgage-container {
// //             padding: 16px;
// //           }
// //         }

// //         /* Cards */
// //         .card {
// //           background: white;
// //           border-radius: 24px;
// //           box-shadow: 0 4px 20px rgba(0,0,0,0.05);
// //           overflow: hidden;
// //         }

// //         .card-header {
// //           padding: 24px 24px 16px;
// //           border-bottom: 1px solid #F0F0F0;
// //         }

// //         .card-header h2 {
// //           font-size: 20px;
// //           font-weight: 600;
// //           margin-bottom: 4px;
// //         }

// //         .card-header p {
// //           font-size: 14px;
// //           color: #8E8E93;
// //         }

// //         .card-body {
// //           padding: 24px;
// //         }

// //         /* Income Toggle */
// //         .income-toggle {
// //           display: flex;
// //           gap: 12px;
// //           margin-bottom: 24px;
// //           padding: 4px;
// //           background: #F5F7FA;
// //           border-radius: 14px;
// //         }

// //         .toggle-option {
// //           flex: 1;
// //           padding: 12px;
// //           text-align: center;
// //           border-radius: 12px;
// //           font-size: 14px;
// //           font-weight: 500;
// //           cursor: pointer;
// //           transition: all 0.2s;
// //           border: none;
// //           background: transparent;
// //           color: #6C6C74;
// //         }

// //         .toggle-option.active {
// //           background: white;
// //           color: #0066FF;
// //           box-shadow: 0 2px 8px rgba(0,0,0,0.08);
// //         }

// //         /* Form Fields */
// //         .form-group {
// //           margin-bottom: 20px;
// //         }

// //         .form-label {
// //           display: block;
// //           font-size: 14px;
// //           font-weight: 500;
// //           margin-bottom: 8px;
// //           color: #3A3A44;
// //         }

// //         .form-label span {
// //           color: #8E8E93;
// //           font-weight: 400;
// //           font-size: 12px;
// //         }

// //         .input-wrapper {
// //           position: relative;
// //         }

// //         .input-prefix {
// //           position: absolute;
// //           left: 16px;
// //           top: 50%;
// //           transform: translateY(-50%);
// //           font-weight: 600;
// //           color: #8E8E93;
// //         }

// //         .input-field {
// //           width: 100%;
// //           padding: 14px 16px 14px 48px;
// //           border: 1.5px solid #E5E5EA;
// //           border-radius: 14px;
// //           font-size: 16px;
// //           transition: all 0.2s;
// //           font-family: inherit;
// //         }

// //         .input-field:focus {
// //           outline: none;
// //           border-color: #0066FF;
// //           box-shadow: 0 0 0 3px rgba(0,102,255,0.1);
// //         }

// //         .input-field::placeholder {
// //           color: #C6C6C8;
// //         }

// //         .tenor-hint {
// //           font-size: 12px;
// //           color: #8E8E93;
// //           margin-top: 6px;
// //           display: flex;
// //           align-items: center;
// //           gap: 6px;
// //         }

// //         /* Calculate Button */
// //         .calculate-btn {
// //           width: 100%;
// //           padding: 16px;
// //           background: #0066FF;
// //           color: white;
// //           border: none;
// //           border-radius: 16px;
// //           font-size: 16px;
// //           font-weight: 600;
// //           cursor: pointer;
// //           transition: all 0.2s;
// //           margin-top: 8px;
// //         }

// //         .calculate-btn:hover {
// //           background: #0052CC;
// //           transform: translateY(-1px);
// //         }

// //         .calculate-btn:active {
// //           transform: translateY(0);
// //         }

// //         /* Results Section */
// //         .results-header {
// //           display: flex;
// //           justify-content: space-between;
// //           align-items: center;
// //           margin-bottom: 20px;
// //         }

// //         .results-header h3 {
// //           font-size: 18px;
// //           font-weight: 600;
// //         }

// //         .info-icon {
// //           color: #8E8E93;
// //           cursor: pointer;
// //         }

// //         /* Scenario Tabs */
// //         .scenario-tabs {
// //           display: flex;
// //           gap: 8px;
// //           margin-bottom: 24px;
// //           overflow-x: auto;
// //           padding-bottom: 4px;
// //         }

// //         .scenario-tab {
// //           flex: 1;
// //           padding: 12px 16px;
// //           background: #F5F7FA;
// //           border: none;
// //           border-radius: 14px;
// //           font-size: 13px;
// //           font-weight: 500;
// //           cursor: pointer;
// //           transition: all 0.2s;
// //           min-width: 100px;
// //           color: #6C6C74;
// //         }

// //         .scenario-tab.active {
// //           background: white;
// //           color: #0066FF;
// //           box-shadow: 0 2px 8px rgba(0,0,0,0.08);
// //           border: 1px solid #E5E5EA;
// //         }

// //         /* Payment Display */
// //         .payment-card {
// //           background: linear-gradient(135deg, #0066FF 0%, #0052CC 100%);
// //           border-radius: 20px;
// //           padding: 24px;
// //           margin-bottom: 24px;
// //           color: white;
// //         }

// //         .payment-label {
// //           font-size: 14px;
// //           opacity: 0.9;
// //           margin-bottom: 8px;
// //         }

// //         .payment-amount {
// //           font-size: 36px;
// //           font-weight: 700;
// //           margin-bottom: 8px;
// //         }

// //         @media (max-width: 480px) {
// //           .payment-amount {
// //             font-size: 28px;
// //           }
// //         }

// //         .payment-sub {
// //           font-size: 12px;
// //           opacity: 0.8;
// //         }

// //         /* Loan Amount Card */
// //         .loan-card {
// //           background: #F8F9FC;
// //           border-radius: 20px;
// //           padding: 20px;
// //           margin-bottom: 24px;
// //         }

// //         .loan-label {
// //           font-size: 13px;
// //           color: #8E8E93;
// //           margin-bottom: 6px;
// //         }

// //         .loan-amount {
// //           font-size: 28px;
// //           font-weight: 700;
// //           color: #1A1A2E;
// //         }

// //         .loan-term {
// //           font-size: 13px;
// //           color: #8E8E93;
// //           margin-top: 6px;
// //         }

// //         /* Breakdown */
// //         .breakdown-card {
// //           background: #F8F9FC;
// //           border-radius: 20px;
// //           padding: 20px;
// //         }

// //         .breakdown-title {
// //           font-size: 14px;
// //           font-weight: 600;
// //           margin-bottom: 16px;
// //         }

// //         .breakdown-item {
// //           display: flex;
// //           justify-content: space-between;
// //           padding: 10px 0;
// //           border-bottom: 1px solid #E5E5EA;
// //           font-size: 14px;
// //         }

// //         .breakdown-item:last-child {
// //           border-bottom: none;
// //         }

// //         .breakdown-label {
// //           color: #6C6C74;
// //         }

// //         .breakdown-value {
// //           font-weight: 500;
// //           color: #1A1A2E;
// //         }

// //         .breakdown-total {
// //           margin-top: 12px;
// //           padding-top: 12px;
// //           border-top: 2px solid #E5E5EA;
// //           font-weight: 600;
// //         }

// //         /* Status Badge */
// //         .status-badge {
// //           display: inline-flex;
// //           align-items: center;
// //           gap: 8px;
// //           padding: 10px 16px;
// //           background: #E8F5E9;
// //           border-radius: 40px;
// //           font-size: 13px;
// //           font-weight: 500;
// //           color: #2E7D32;
// //           margin-top: 20px;
// //         }

// //         /* Callback Button */
// //         .callback-btn {
// //           width: 100%;
// //           padding: 14px;
// //           background: white;
// //           border: 2px solid #0066FF;
// //           border-radius: 16px;
// //           font-size: 15px;
// //           font-weight: 600;
// //           color: #0066FF;
// //           cursor: pointer;
// //           transition: all 0.2s;
// //           margin-top: 16px;
// //         }

// //         .callback-btn:hover {
// //           background: #F0F7FF;
// //         }

// //         /* Footer Steps */
// //         .footer-steps {
// //           margin-top: 32px;
// //           display: flex;
// //           justify-content: space-between;
// //           flex-wrap: wrap;
// //           gap: 16px;
// //           padding: 20px;
// //           background: white;
// //           border-radius: 20px;
// //           font-size: 13px;
// //           color: #6C6C74;
// //         }

// //         .legal-note {
// //           margin-top: 20px;
// //           padding: 16px;
// //           background: #F5F7FA;
// //           border-radius: 16px;
// //           font-size: 12px;
// //           color: #8E8E93;
// //           text-align: center;
// //           border-left: 3px solid #0066FF;
// //         }
// //       `}</style>

// //       <div className="mortgage-container">
// //         {/* Header with Step Indicator */}
// //         <div className="header">
// //           <div className="step-indicator">
// //             <div className="step completed">
// //               <div className="step-number">✓</div>
// //               <span>Property</span>
// //             </div>
// //             <span className="step-arrow">→</span>
// //             <div className="step active">
// //               <div className="step-number">2</div>
// //               <span>Financials</span>
// //             </div>
// //             <span className="step-arrow">→</span>
// //             <div className="step">
// //               <div className="step-number">3</div>
// //               <span>Application</span>
// //             </div>
// //             <span className="step-arrow">→</span>
// //             <div className="step">
// //               <div className="step-number">4</div>
// //               <span>Review</span>
// //             </div>
// //           </div>

// //           {selectedProduct && (
// //             <div className="product-selector">
// //               <div className="product-info">
// //                 <span className="product-badge">Selected Product</span>
// //                 <span className="product-name">{selectedProduct.label}</span>
// //               </div>
// //               {onChangeProduct && (
// //                 <button className="change-btn" onClick={onChangeProduct}>
// //                   Change Product
// //                 </button>
// //               )}
// //             </div>
// //           )}
// //         </div>

// //         {/* Main Content Grid */}
// //         <div className="main-grid">
// //           {/* Left Column - Input Form */}
// //           <div className="card">
// //             <div className="card-header">
// //               <h2>Your Financial Information</h2>
// //               <p>Enter your income and obligations to check eligibility</p>
// //             </div>
// //             <div className="card-body">
// //               {/* Income Source Toggle */}
// //               <div className="income-toggle">
// //                 <button 
// //                   className={`toggle-option ${incomeSource === 'employed' ? 'active' : ''}`}
// //                   onClick={() => setIncomeSource('employed')}
// //                 >
// //                   💼 Employed
// //                 </button>
// //                 {!isStandardMortgage && (
// //                   <button 
// //                     className={`toggle-option ${incomeSource === 'business' ? 'active' : ''}`}
// //                     onClick={() => setIncomeSource('business')}
// //                   >
// //                     🏢 Business
// //                   </button>
// //                 )}
// //               </div>

// //               {/* Dynamic Income Field */}
// //               {incomeSource === 'employed' && (
// //                 <div className="form-group">
// //                   <label className="form-label">Monthly Net Income <span>(after tax)</span></label>
// //                   <div className="input-wrapper">
// //                     <span className="input-prefix">KES</span>
// //                     <input 
// //                       type="text" 
// //                       id="salaryIncome" 
// //                       className="input-field" 
// //                       placeholder="0" 
// //                       autoComplete="off"
// //                     />
// //                   </div>
// //                 </div>
// //               )}

// //               {incomeSource === 'business' && (
// //                 <div className="form-group">
// //                   <label className="form-label">Monthly Business Turnover</label>
// //                   <div className="input-wrapper">
// //                     <span className="input-prefix">KES</span>
// //                     <input 
// //                       type="text" 
// //                       id="businessIncome" 
// //                       className="input-field" 
// //                       placeholder="0" 
// //                       autoComplete="off"
// //                     />
// //                   </div>
// //                 </div>
// //               )}

// //               {/* Existing Obligations */}
// //               <div className="form-group">
// //                 <label className="form-label">Existing Monthly Obligations</label>
// //                 <div className="input-wrapper">
// //                   <span className="input-prefix">KES</span>
// //                   <input 
// //                     type="text" 
// //                     id="loanObligations" 
// //                     className="input-field" 
// //                     placeholder="0" 
// //                     autoComplete="off"
// //                   />
// //                 </div>
// //                 <div className="tenor-hint">
// //                   <span>💳</span> Include car loans, credit cards, and other debt payments
// //                 </div>
// //               </div>

// //               {/* Loan Tenor */}
// //               <div className="form-group">
// //                 <label className="form-label">Preferred Loan Tenor</label>
// //                 <div className="input-wrapper">
// //                   <input 
// //                     type="number" 
// //                     id="loanTenor" 
// //                     className="input-field" 
// //                     placeholder="20" 
// //                     min="1" 
// //                     max="25"
// //                     style={{ paddingLeft: '16px' }}
// //                   />
// //                   <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#8E8E93' }}>
// //                     years
// //                   </span>
// //                 </div>
// //                 <div className="tenor-hint">
// //                   <span>ⓘ</span> Maximum 25 years
// //                 </div>
// //               </div>

// //               <button className="calculate-btn" onClick={handleCalculate}>
// //                 Calculate Eligibility →
// //               </button>
// //             </div>
// //           </div>

// //           {/* Right Column - Results */}
// //           <div className="card">
// //             <div className="card-header">
// //               <div className="results-header">
// //                 <h3>Your Loan Assessment</h3>
// //                 <span className="info-icon" title="Based on your financial information and current rates">ⓘ</span>
// //               </div>
// //             </div>
// //             <div className="card-body">
// //               {/* Scenario Tabs */}
// //               <div className="scenario-tabs">
// //                 {scenarios.map(scenario => (
// //                   <button
// //                     key={scenario.id}
// //                     className={`scenario-tab ${activeScenario === scenario.id ? 'active' : ''}`}
// //                     onClick={() => setActiveScenario(scenario.id)}
// //                   >
// //                     {scenario.name}
// //                   </button>
// //                 ))}
// //               </div>

// //               {/* Monthly Payment */}
// //               <div className="payment-card">
// //                 <div className="payment-label">Estimated Monthly Payment</div>
// //                 <div className="payment-amount">{formatKES(monthlyPayment)}</div>
// //                 <div className="payment-sub">
// //                   {scenarios.find(s => s.id === activeScenario)?.name} • Principal + Interest
// //                 </div>
// //               </div>

// //               {/* Loan Amount */}
// //               <div className="loan-card">
// //                 <div className="loan-label">Estimated Loan Amount</div>
// //                 <div className="loan-amount">{formatKES(loanAmount)}</div>
// //                 <div className="loan-term">
// //                   Based on {document.getElementById('loanTenor')?.value || '20'} year term at {
// //                     scenarios.find(s => s.id === activeScenario)?.rate
// //                   }% APR (illustrative)
// //                 </div>
// //               </div>

// //               {/* Eligibility Breakdown */}
// //               <div className="breakdown-card">
// //                 <div className="breakdown-title">Eligibility Breakdown</div>
// //                 <div className="breakdown-item">
// //                   <span className="breakdown-label">Gross Monthly Income</span>
// //                   <span className="breakdown-value">
// //                     {formatKES(parseFormattedNumber(document.getElementById('salaryIncome')?.value) || 
// //                                parseFormattedNumber(document.getElementById('businessIncome')?.value))}
// //                   </span>
// //                 </div>
// //                 <div className="breakdown-item">
// //                   <span className="breakdown-label">DBR Capacity (60%)</span>
// //                   <span className="breakdown-value">
// //                     {formatKES((parseFormattedNumber(document.getElementById('salaryIncome')?.value) || 
// //                                (parseFormattedNumber(document.getElementById('businessIncome')?.value) * 0.5)) * 0.6)}
// //                   </span>
// //                 </div>
// //                 <div className="breakdown-item">
// //                   <span className="breakdown-label">Less: Existing Obligations</span>
// //                   <span className="breakdown-value">
// //                     -{formatKES(parseFormattedNumber(document.getElementById('loanObligations')?.value))}
// //                   </span>
// //                 </div>
// //                 <div className="breakdown-item breakdown-total">
// //                   <span className="breakdown-label">Available for Mortgage</span>
// //                   <span className="breakdown-value">{formatKES(monthlyPayment)}</span>
// //                 </div>
// //               </div>

// //               {/* Status and Callback */}
// //               <div className="status-badge">
// //                 {loanAmount > 0 ? '✅ You pre-qualify! Continue to application' : '📋 Complete your details to check eligibility'}
// //               </div>

// //               {calculated && (loanAmount > 0 || loanResultId) && (
// //                 <button className="callback-btn" onClick={handleOpenCallback}>
// //                   📞 Request a Callback
// //                 </button>
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Footer */}
// //         <div className="footer-steps">
// //           <span>1️⃣ Enter your financial information</span>
// //           <span>2️⃣ We calculate your eligibility</span>
// //           <span>3️⃣ View your results instantly</span>
// //           <span>📌 Max loan tenor: 25 years</span>
// //         </div>

// //         <div className="legal-note">
// //           ⚠️ This is a preliminary qualification based on the information provided. 
// //           Final approval requires full documentation, credit review, and underwriting. 
// //           Rates are illustrative and subject to change.
// //         </div>
// //       </div>

// //       {showCallbackModal && (
// //         <CallbackRequestModal
// //           loanResultId={loanResultId}
// //           loanResponse={loanResponse}
// //           loanInputs={loanInputs}
// //           onClose={() => setShowCallbackModal(false)}
// //           onSuccess={() => setShowCallbackModal(false)}
// //         />
// //       )}
// //     </div>
// //   );
// // }









import React, { useEffect, useState } from 'react';
import CallbackRequestModal from './CallbackRequestModal';
import loanService from '../services/loanService';

export default function ModernLoanCalculator({ selectedProduct, onChangeProduct }) {
  const [incomeSource, setIncomeSource] = useState('employed');
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [loanResultId, setLoanResultId] = useState(null);
  const [loanResponse, setLoanResponse] = useState(null);
  const [loanInputs, setLoanInputs] = useState(null);
  const isStandardMortgage = selectedProduct?.id === 'standard';
  const standardMortgageRate = 14.02;

  const parseFormattedNumber = (value) => {
    const normalized = (value || '').toString().replace(/,/g, '').trim();
    if (normalized === '') return 0;
    const parsed = Number.parseFloat(normalized);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const formatNumberWithCommas = (value) => {
    const digitsOnly = (value || '').toString().replace(/\D/g, '');
    if (!digitsOnly) return '';
    return Number.parseInt(digitsOnly, 10).toLocaleString('en-US');
  };

  const formatCurrencyInput = (inputElement) => {
    if (!inputElement) return;
    const formatted = formatNumberWithCommas(inputElement.value);
    inputElement.value = formatted;
    if (document.activeElement === inputElement && typeof inputElement.setSelectionRange === 'function') {
      inputElement.setSelectionRange(formatted.length, formatted.length);
    }
  };

  useEffect(() => {
    // Mirror the original script: DOM-driven logic for exact visual parity
    const salaryEl = () => document.getElementById('salaryIncome');
    const businessEl = () => document.getElementById('businessIncome');
    const rentEl = () => document.getElementById('rentalPayment');
    const obligationsEl = () => document.getElementById('loanObligations');
    const tenorEl = () => document.getElementById('loanTenor');
    const calcButton = document.getElementById('calculateTrigger');

    const monthlyResultSpan = document.getElementById('displayMonthly');
    const loanAmountSpan = document.getElementById('displayLoanAmount');
    const breakdownMonthlySpan = document.getElementById('breakdownMonthly');
    const breakdownDetailsSpan = document.getElementById('breakdownDetails');
    const loanTenorTextSpan = document.getElementById('loanTenorText');
    const statusBadge = document.getElementById('statusBadge');

    function getNumericValue(inputElement) {
      if (!inputElement) return 0;
      let val = (inputElement.value || '').toString().trim();
      if (val === '') return 0;
      let num = parseFormattedNumber(val);
      return isNaN(num) ? 0 : num;
    }

    function isCurrencyInput(inputElement) {
      return !!inputElement && ['salaryIncome', 'businessIncome', 'rentalPayment', 'loanObligations'].includes(inputElement.id);
    }

    function computeMaxMonthlyPayment(salary, business, rental, obligations) {
      const salaryPortion = salary * 0.6;
      const businessPortion = business * 0.15;
      const totalAvailable = salaryPortion + businessPortion + rental;
      const maxMonthly = Math.max(0, totalAvailable - obligations);
      return { maxMonthly, salaryPortion, businessPortion, totalAvailable };
    }

    function calculateLoanAmount(monthlyPayment, years, annualRatePercent = 5.75) {
      if (monthlyPayment <= 0 || years <= 0) return 0;
      const monthlyRate = annualRatePercent / 100 / 12;
      const months = years * 12;
      const discountFactor = (1 - Math.pow(1 + monthlyRate, -months)) / monthlyRate;
      let loan = monthlyPayment * discountFactor;
      if (isNaN(loan) || !isFinite(loan)) return 0;
      return Math.max(0, loan);
    }

    function determineBusinessApr(monthlyTurnover) {
      if (!monthlyTurnover || isNaN(Number(monthlyTurnover))) return 9.9;
      return Number(monthlyTurnover) < 2000000 ? 9.5 : 9.9;
    }

    function formatKES(value) {
      return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    }

    function refreshCalculation() {
      const salary = getNumericValue(salaryEl());
      const business = getNumericValue(businessEl());
      const rental = incomeSource === 'employed' ? 0 : getNumericValue(rentEl());
      const obligations = getNumericValue(obligationsEl());
      const tenorElement = tenorEl();
      let tenorYears = getNumericValue(tenorElement);

      if (tenorYears < 1 || isNaN(tenorYears)) tenorYears = 1;
      if (tenorYears > 25) tenorYears = 25;
      let effectiveTenor = tenorYears;
      if (!tenorElement || (tenorElement.value || '').toString().trim() === '') effectiveTenor = 1;

      let estimatedLoan = 0;
      let roundedMonthly = 0;
      let breakdownHtml = '';
      let totalAvailable = 0;
      let salaryPortion = 0;
      let businessPortion = 0;
      let maxMonthly = 0;

      let appliedInterestRate = 5.75;
      if (incomeSource === 'employed') {
        const netMonthlyIncome = salary;
        const dbrCap = netMonthlyIncome * 0.60;
        const availableEMI = dbrCap - obligations;
        totalAvailable = dbrCap + rental;

        roundedMonthly = Math.max(0, Math.round(availableEMI));

        if (monthlyResultSpan) monthlyResultSpan.innerText = formatKES(roundedMonthly);

        if (availableEMI <= 0) {
          estimatedLoan = 0;
          if (loanAmountSpan) loanAmountSpan.innerText = formatKES(0);
          const salaryDesc = `Salary (DBR 60%): ${formatKES(Math.round(netMonthlyIncome * 0.60))}`;
          const obligationsDesc = `Existing debts: -${formatKES(obligations)}`;
          const deficit = Math.abs(Math.round(availableEMI));
          breakdownHtml = `${salaryDesc}<br>${obligationsDesc}<br>Deficit: ${formatKES(deficit)} → <strong>Does not qualify</strong>`;
          if (statusBadge) {
            statusBadge.innerHTML = "⚠️ Does not qualify — obligations exceed DBR cap";
            statusBadge.style.background = "#fee9e6";
            statusBadge.style.color = "#b13e3e";
          }
        } else {
          const tenorYears = Math.max(1, effectiveTenor);
          const annualRate = isStandardMortgage ? standardMortgageRate : tenorYears <= 20 ? 9.5 : 9.9;
          appliedInterestRate = annualRate;
          const monthlyRate = (annualRate / 100) / 12;
          const n = tenorYears * 12;
          const rPlusOnePowN = Math.pow(1 + monthlyRate, n);
          const numerator = rPlusOnePowN - 1;
          const denominator = monthlyRate * rPlusOnePowN;
          const loanAmount = availableEMI * (numerator / denominator);
          estimatedLoan = Math.max(0, Math.round(loanAmount));

          if (loanAmountSpan) loanAmountSpan.innerText = formatKES(estimatedLoan);

          const salaryDesc = `Salary (DBR 60%): ${formatKES(Math.round(dbrCap))}`;
          const obligationsDesc = `Existing debts: -${formatKES(obligations)}`;
          const rentDesc = rental ? `Rent credit: +${formatKES(rental)}` : '';
          const totalDesc = `Available EMI: ${formatKES(Math.round(availableEMI))}`;
          breakdownHtml = `${salaryDesc}<br>${obligationsDesc}<br>${rentDesc}<br>${totalDesc} → <strong>Net monthly capacity</strong><br><small>Est. rate: ${appliedInterestRate}% APR (illustrative)</small>`;
          if (statusBadge) {
            statusBadge.innerHTML = "✅ Preliminary prequalification — subject to verification";
            statusBadge.style.background = "#e0f0e8";
            statusBadge.style.color = "#1a6e4a";
          }
        }
      } else {
        if (salary <= 0 && business > 0) {
          const PROFIT_MARGIN = 0.50;
          const DBR_RATE = 0.40;
          const monthlyTurnover = business;
          const netIncome = monthlyTurnover * PROFIT_MARGIN;
          const dbrCap = netIncome * DBR_RATE;
          const availableEMI = dbrCap - (obligations + rental);

          roundedMonthly = Math.max(0, Math.round(availableEMI));
          if (monthlyResultSpan) monthlyResultSpan.innerText = formatKES(roundedMonthly);

          if (roundedMonthly > 0 && effectiveTenor >= 1) {
            const apr = determineBusinessApr(business);
            appliedInterestRate = apr;
            const monthlyRate = (apr / 100) / 12;
            const n = effectiveTenor * 12;
            const rPlusOnePowN = Math.pow(1 + monthlyRate, n);
            const numerator = rPlusOnePowN - 1;
            const denominator = monthlyRate * rPlusOnePowN;
            const loanAmount = availableEMI * (numerator / denominator);
            estimatedLoan = Math.max(0, Math.round(loanAmount));
          }
          if (loanAmountSpan) loanAmountSpan.innerText = formatKES(estimatedLoan);

          const salaryDesc = `Business turnover (Profit 50%): ${formatKES(Math.round(netIncome))}`;
          const obligationsDesc = `Existing debts + rent: -${formatKES(Math.round(obligations + rental))}`;
          const totalDesc = `Available EMI: ${formatKES(Math.round(availableEMI))}`;
          breakdownHtml = `${salaryDesc}<br>${obligationsDesc}<br>${totalDesc} → <strong>Net monthly capacity</strong><br><small>Est. rate: ${appliedInterestRate}% APR (illustrative)</small>`;
        } else {
          const computed = computeMaxMonthlyPayment(salary, business, rental, obligations);
          maxMonthly = computed.maxMonthly;
          salaryPortion = computed.salaryPortion;
          businessPortion = computed.businessPortion;
          totalAvailable = computed.totalAvailable;
          roundedMonthly = Math.round(maxMonthly);
          if (monthlyResultSpan) monthlyResultSpan.innerText = formatKES(roundedMonthly);

          if (roundedMonthly > 0 && effectiveTenor >= 1) {
            const apr = determineBusinessApr(business);
            appliedInterestRate = apr;
            estimatedLoan = calculateLoanAmount(roundedMonthly, effectiveTenor, apr);
            estimatedLoan = Math.round(estimatedLoan);
          }
          if (loanAmountSpan) loanAmountSpan.innerText = formatKES(estimatedLoan);

          if (breakdownMonthlySpan) breakdownMonthlySpan.innerText = formatKES(roundedMonthly) + ' / month';
          const salaryDesc = `Salary (60%): ${formatKES(salaryPortion)}`;
          const businessDesc = `Business adj. (20% after 25% discount): ${formatKES(businessPortion)}`;
          const rentDesc = `Rent credit: +${formatKES(rental)}`;
          const totalDesc = `Gross capacity: ${formatKES(totalAvailable)}`;
          const obligationsDesc = `Existing debts: -${formatKES(obligations)}`;
          appliedInterestRate = 5.75;
          breakdownHtml = `${salaryDesc}<br>${businessDesc}<br>${rentDesc}<br>${totalDesc}<br>${obligationsDesc} → <strong>Net monthly capacity</strong><br><small>Est. rate: ${appliedInterestRate}% APR (illustrative)</small>`;
        }
      }

      if (breakdownDetailsSpan) breakdownDetailsSpan.innerHTML = breakdownHtml;

      if (loanTenorTextSpan) {
          const tenorValue = tenorElement && (tenorElement.value || '').toString().trim();
          if (!tenorElement || tenorValue === '') {
            loanTenorTextSpan.innerHTML = `No tenor entered (default 1y for estimate) · ${appliedInterestRate}% APR illustrative`;
          } else {
            loanTenorTextSpan.innerHTML = `${effectiveTenor} year term · Est. rate ${appliedInterestRate}% APR (illustrative) · P&I only.`;
          }
      }

      if (statusBadge) {
        if (roundedMonthly <= 0 && (salary === 0 && business === 0 && rental === 0 && obligations === 0)) {
          statusBadge.innerHTML = "📋 Enter your financial info to see eligibility";
          statusBadge.style.background = "#eef2f7";
          statusBadge.style.color = "#5d7e96";
        } else if (roundedMonthly <= 0 && (salary > 0 || business > 0 || rental > 0)) {
          statusBadge.innerHTML = "⚠️ Low capacity — obligations exceed or equal available income";
          statusBadge.style.background = "#fee9e6";
          statusBadge.style.color = "#b13e3e";
        } else if (roundedMonthly > 0) {
          statusBadge.innerHTML = "✅ Preliminary prequalification — subject to verification";
          statusBadge.style.background = "#e0f0e8";
          statusBadge.style.color = "#1a6e4a";
        } else {
          statusBadge.innerHTML = "📋 Fill in your details";
          statusBadge.style.background = "#eef2f7";
          statusBadge.style.color = "#5d7e96";
        }

        if (obligations > totalAvailable && totalAvailable > 0 && roundedMonthly === 0) {
          statusBadge.innerHTML = "⚠️ Existing obligations exceed housing capacity — adjust debts";
          statusBadge.style.background = "#fff0e0";
          statusBadge.style.color = "#b45f1b";
        }
      }
    }

    function enforceTenorConstraints() {
      const t = tenorEl();
      if (!t) return;
      let val = (t.value || '').toString().trim();
      if (val === '') return;
      let num = parseFormattedNumber(val);
      if (isNaN(num)) { t.value = ''; if (calculated) refreshCalculation(); return; }
      if (num < 1) t.value = '1';
      else if (num > 25) t.value = '25';
      if (calculated) refreshCalculation();
    }

    const inputs = [salaryEl(), businessEl(), rentEl(), obligationsEl(), tenorEl()];
    inputs.forEach(input => {
      if (!input || typeof input.addEventListener !== 'function') return;
      const onInput = () => {
        try {
          if (isCurrencyInput(input)) formatCurrencyInput(input);
          if (!calculated) return;
          refreshCalculation();
        } catch (e) { console.error(e); }
      };
      const onBlur = () => {
        try {
          if (isCurrencyInput(input)) formatCurrencyInput(input);
          if (input === tenorEl()) enforceTenorConstraints();
          if (!calculated) return;
          refreshCalculation();
        } catch (e) { console.error(e); }
      };
      input.addEventListener('input', onInput);
      input.addEventListener('blur', onBlur);
      input._onInput = onInput;
      input._onBlur = onBlur;
    });

    if (calcButton) {
      const onClick = async (e) => {
        e.preventDefault();
        setCalculated(true);
        enforceTenorConstraints();
        refreshCalculation();

        const s = getNumericValue(salaryEl());
        const b = getNumericValue(businessEl());
        const r = incomeSource === 'employed' ? 0 : getNumericValue(rentEl());
        const hasIncome = (s > 0) || (b > 0) || (r > 0);

        let estimated = 0;
        try {
          const txt = (loanAmountSpan && loanAmountSpan.innerText) ? loanAmountSpan.innerText : '';
          estimated = Number(txt.replace(/[^0-9.-]+/g, '')) || 0;
        } catch (err) { estimated = 0; }
        let monthly = 0;
        try {
          const mtxt = (monthlyResultSpan && monthlyResultSpan.innerText) ? monthlyResultSpan.innerText : '';
          monthly = Number(mtxt.replace(/[^0-9.-]+/g, '')) || 0;
        } catch (err) { monthly = 0; }

        try {
          const displayedMonthlyText = (monthlyResultSpan && monthlyResultSpan.innerText) ? monthlyResultSpan.innerText : '';
          const displayedMonthlyNum = Number(displayedMonthlyText.replace(/[^0-9.-]+/g, '')) || 0;
          const shouldShow = hasIncome || estimated > 0 || displayedMonthlyNum > 0;
          setHasResults(shouldShow);
          window.dispatchEvent(new CustomEvent('loanCalcCalculated', { detail: { estimatedLoan: estimated, monthlyPayment: monthly } }));
        } catch (err) {}

        try {
          const payload = {
            productType: selectedProduct?.id || null,
            monthlySalaryIncome: s,
            monthlyBusinessIncome: b,
            monthlyRentalPayments: r,
            existingLoanObligations: getNumericValue(obligationsEl()),
            preferredLoanTenorYears: parseInt((tenorEl() && (tenorEl().value || '').toString().trim()) || '1', 10)
          };
          setLoanInputs(payload);
          const resp = await loanService.calculateLoan(payload);
          if (resp) {
            setLoanResponse(resp);
            setLoanResultId(resp.loanResultId || resp.LoanResultId || null);
            try { if (monthlyResultSpan) monthlyResultSpan.innerText = formatKES(Math.round(resp.estimatedMonthlyRepayment || resp.EstimatedMonthlyRepayment || 0)); } catch {}
            try { if (loanAmountSpan) loanAmountSpan.innerText = formatKES(Math.round(resp.maximumLoanAmount || resp.MaximumLoanAmount || 0)); } catch {}
            try {
              if (loanTenorTextSpan) {
                const years = Math.round((resp.loanTenorMonths || resp.LoanTenorMonths || 0) / 12) || payload.preferredLoanTenorYears;
                let apr = resp.appliedInterestRate || resp.AppliedInterestRate || resp.appliedinterestRate || resp.AppliedInterestRate || null;
                if (apr === null || apr === undefined) {
                  apr = determineBusinessApr(payload.monthlyBusinessIncome || payload.monthlyBusinessIncome || 0);
                } else if (apr > 0 && apr < 1) apr = apr * 100;
                loanTenorTextSpan.innerHTML = `${years} year term · Est. rate ${apr}% APR (illustrative) · P&I only.`;
              }
            } catch {}
          }
        } catch (apiErr) {
          console.warn('Calculate API failed', apiErr);
        }

        calcButton.style.transform = 'scale(0.97)';
        setTimeout(() => { calcButton.style.transform = ''; }, 150);
      };
      calcButton.addEventListener('click', onClick);
      calcButton._onClick = onClick;
    }

    if (salaryEl()) salaryEl().value = '';
    if (businessEl()) businessEl().value = '';
    if (rentEl()) rentEl().value = '';
    if (obligationsEl()) obligationsEl().value = '';
    if (tenorEl()) tenorEl().value = '';

    return () => {
      inputs.forEach(input => {
        if (!input) return;
        if (input._onInput) input.removeEventListener('input', input._onInput);
        if (input._onBlur) input.removeEventListener('blur', input._onBlur);
        delete input._onInput; delete input._onBlur;
      });
      if (calcButton && calcButton._onClick) {
        calcButton.removeEventListener('click', calcButton._onClick);
        delete calcButton._onClick;
      }
    };
  }, [incomeSource, calculated]);

  useEffect(() => {
    const handler = (ev) => {
      const estimated = Number(ev?.detail?.estimatedLoan) || 0;
      if (estimated > 0) setHasResults(true);
      else setHasResults(false);
    };
    window.addEventListener('loanCalcCalculated', handler);
    return () => window.removeEventListener('loanCalcCalculated', handler);
  }, []);

  useEffect(() => {
    if (isStandardMortgage && incomeSource !== 'employed') {
      setIncomeSource('employed');
    }
  }, [isStandardMortgage, incomeSource]);

  async function handleOpenCallback() {
    if (loanResultId) {
      setShowCallbackModal(true);
      return;
    }

    const getElValue = (id) => {
      const el = document.getElementById(id);
      if (!el) return 0;
      const v = (el.value || '').toString().trim();
      const n = parseFormattedNumber(v);
      return isNaN(n) ? 0 : n;
    };

    const s = getElValue('salaryIncome');
    const b = getElValue('businessIncome');
    const r = incomeSource === 'employed' ? 0 : getElValue('rentalPayment');
    const payload = {
      productType: selectedProduct?.id || null,
      monthlySalaryIncome: s,
      monthlyBusinessIncome: b,
      monthlyRentalPayments: r,
      existingLoanObligations: getElValue('loanObligations'),
      preferredLoanTenorYears: parseInt((document.getElementById('loanTenor')?.value || '1').toString().trim(), 10) || 1
    };
    setLoanInputs(payload);

    try {
      const resp = await loanService.calculateLoan(payload);
      if (resp) {
        setLoanResponse(resp);
        setLoanResultId(resp.loanResultId || resp.LoanResultId || null);
      }
    } catch (err) {
      console.warn('Could not persist calculation before callback:', err);
    }

    setShowCallbackModal(true);
  }

  useEffect(() => {
    const salaryEl = document.getElementById('salaryIncome');
    const businessEl = document.getElementById('businessIncome');
    const rentEl = document.getElementById('rentalPayment');
    setCalculated(false);
    setHasResults(false);
    const monthlyResultSpan = document.getElementById('displayMonthly');
    const loanAmountSpan = document.getElementById('displayLoanAmount');
    const breakdownMonthlySpan = document.getElementById('breakdownMonthly');
    const breakdownDetailsSpan = document.getElementById('breakdownDetails');
    const statusBadge = document.getElementById('statusBadge');

    if (incomeSource === 'employed') {
      if (businessEl) businessEl.value = '';
      if (rentEl) rentEl.value = '';
    }
    if (incomeSource === 'business') {
      if (salaryEl) salaryEl.value = '';
    }

    if (monthlyResultSpan) monthlyResultSpan.innerText = 'Ksh 0';
    if (loanAmountSpan) loanAmountSpan.innerText = 'Ksh 0';
    if (breakdownMonthlySpan) breakdownMonthlySpan.innerText = '—';
    if (breakdownDetailsSpan) breakdownDetailsSpan.innerHTML = 'Salary 60% + Business adj. + Rent credit – existing debts';
    if (statusBadge) {
      statusBadge.innerHTML = '📋 Fill in your details';
      statusBadge.style.background = '#eef2f7';
      statusBadge.style.color = '#5d7e96';
    }
  }, [incomeSource]);

  // UI-ONLY CHANGES - Professional modern design preserving all functionality
  return (
    <div>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: linear-gradient(135deg, #f5f7fa 0%, #e9edf2 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: clamp(1rem, 3vw, 2rem);
          color: #1a2c3e;
          min-height: 100vh;
        }

        .loan-wrapper {
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Header Section */
        .brand-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .brand-header h1 {
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          font-weight: 700;
          background: linear-gradient(135deg, #1e3c5c, #2a5298);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          letter-spacing: -0.5px;
        }

        .brand-header p {
          color: #5a6e7c;
          margin-top: 0.5rem;
          font-size: 1rem;
        }

        /* Step Indicator */
        .step-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .step {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #94a3b8;
        }

        .step.active {
          color: #2a5298;
          font-weight: 600;
        }

        .step.completed {
          color: #10b981;
        }

        .step-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .step.active .step-number {
          background: #2a5298;
          color: white;
        }

        .step.completed .step-number {
          background: #10b981;
          color: white;
        }

        .step-arrow {
          color: #cbd5e1;
          font-size: 1rem;
        }

        /* Product Banner */
        .product-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding: 1rem 1.5rem;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          border: 1px solid #e2e8f0;
        }

        .product-step {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          font-weight: 600;
        }

        .product-label {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #f1f5f9;
          border-radius: 2rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;
        }

        .product-change {
          border: 1px solid #e2e8f0;
          background: white;
          color: #2a5298;
          border-radius: 2rem;
          padding: 0.5rem 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .product-change:hover {
          background: #f8fafc;
          border-color: #2a5298;
        }

        /* Income Source Selector */
        .income-source {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding: 0.5rem;
          background: #f1f5f9;
          border-radius: 1rem;
        }

        .income-source label {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
          color: #64748b;
        }

        .income-source input[type="radio"] {
          accent-color: #2a5298;
        }

        .income-source label:has(input:checked) {
          background: white;
          color: #2a5298;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        /* Grid Layout */
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }

        /* Cards */
        .card-panel {
          background: white;
          border-radius: 1.5rem;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.03);
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .card-panel:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 35px -12px rgba(0,0,0,0.1);
        }

        .card-title {
          padding: 1.25rem 1.5rem 0.75rem;
          font-weight: 700;
          font-size: 1.25rem;
          border-bottom: 2px solid #f1f5f9;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
        }

        .card-body {
          padding: 1.5rem;
        }

        /* Form Styling */
        .input-section {
          margin-bottom: 1.5rem;
        }

        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .field-label {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.875rem;
        }

        .badge-hint {
          font-size: 0.7rem;
          background: #f1f5f9;
          padding: 0.2rem 0.6rem;
          border-radius: 1rem;
          color: #64748b;
        }

        .input-wrapper {
          position: relative;
        }

        .input-field {
          width: 100%;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 0.75rem;
          background: white;
          transition: all 0.2s;
          font-family: inherit;
        }

        .input-field:focus {
          outline: none;
          border-color: #2a5298;
          box-shadow: 0 0 0 3px rgba(42,82,152,0.1);
        }

        .input-field::placeholder {
          color: #cbd5e1;
        }

        hr {
          margin: 1rem 0;
          border: 0;
          height: 1px;
          background: linear-gradient(to right, #e2e8f0, transparent);
        }

        .tenor-note {
          font-size: 0.7rem;
          color: #64748b;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        /* Calculate Button */
        .calc-btn {
          width: 100%;
          background: linear-gradient(135deg, #2a5298, #1e3c5c);
          border: none;
          padding: 1rem;
          font-size: 1rem;
          font-weight: 600;
          color: white;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 0.5rem;
        }

        .calc-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -5px rgba(42,82,152,0.3);
        }

        .calc-btn:active {
          transform: translateY(0);
        }

        /* Results Area */
        .results-container {
          background: linear-gradient(135deg, #ffffff, #fafcff);
        }

        .result-block {
          background: #f8fafc;
          border-radius: 1rem;
          padding: 1.25rem;
          margin-bottom: 1.25rem;
          transition: all 0.2s;
          border: 1px solid #e2e8f0;
        }

        .result-block.highlight {
          background: linear-gradient(135deg, #2a5298, #1e3c5c);
          border: none;
        }

        .result-block.highlight .result-label,
        .result-block.highlight .result-value,
        .result-block.highlight .result-footnote {
          color: white;
        }

        .result-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 700;
          color: #64748b;
          margin-bottom: 0.5rem;
        }

        .result-value {
          font-size: clamp(1.5rem, 4vw, 2rem);
          font-weight: 800;
          color: #1e293b;
          line-height: 1.2;
        }

        .result-footnote {
          font-size: 0.7rem;
          color: #94a3b8;
          margin-top: 0.5rem;
        }

        .eligibility-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          font-size: 0.75rem;
          font-weight: 600;
          margin-top: 0.5rem;
        }

        /* Callback Button */
        .callback-btn {
          width: 100%;
          background: white;
          border: 2px solid #2a5298;
          padding: 0.875rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #2a5298;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 1rem;
        }

        .callback-btn:hover {
          background: #f8fafc;
          transform: translateY(-1px);
        }

        /* Footer */
        .steps-row {
          margin-top: 2rem;
          background: white;
          border-radius: 1rem;
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          font-size: 0.8rem;
          font-weight: 500;
          color: #475569;
          border: 1px solid #e2e8f0;
        }

        .legal-note {
          margin-top: 1.5rem;
          font-size: 0.7rem;
          text-align: center;
          color: #64748b;
          background: #f8fafc;
          padding: 1rem;
          border-radius: 0.75rem;
          border-left: 3px solid #2a5298;
        }
      `}</style>

      <div className="loan-wrapper">
        {/* Step Indicator */}
        <div className="step-indicator">
          <div className="step completed">
            <div className="step-number">✓</div>
            <span>Property</span>
          </div>
          <span className="step-arrow">→</span>
          <div className="step active">
            <div className="step-number">2</div>
            <span>Financials</span>
          </div>
          <span className="step-arrow">→</span>
          <div className="step">
            <div className="step-number">3</div>
            <span>Application</span>
          </div>
          <span className="step-arrow">→</span>
          <div className="step">
            <div className="step-number">4</div>
            <span>Review</span>
          </div>
        </div>

        <div className="brand-header">
          <h1>🏡 Mortgage Prequalification</h1>
          <p>Enter your financial information below to get started</p>
        </div>

        {selectedProduct && (
          <div className="product-banner">
            <div>
              <p className="product-step">Step 2 of 2</p>
              <div className="product-label">
                <span>Product</span>
                <span>{selectedProduct.label}</span>
              </div>
            </div>
            {onChangeProduct && (
              <button type="button" className="product-change" onClick={onChangeProduct}>
                Change product
              </button>
            )}
          </div>
        )}

        <div className="form-grid">
          {/* Left Column - Input Form */}
          <div className="card-panel">
            <div className="card-title">
              <span>📋</span> Income & Obligations
            </div>
            <div className="card-body">
              <div className="income-source" role="radiogroup">
                <label>
                  <input type="radio" name="incomeSource" value="employed" checked={incomeSource === 'employed'} onChange={() => setIncomeSource('employed')} />
                  💼 Employed
                </label>
                {!isStandardMortgage && (
                  <label>
                    <input type="radio" name="incomeSource" value="business" checked={incomeSource === 'business'} onChange={() => setIncomeSource('business')} />
                    🏢 Business
                  </label>
                )}
              </div>

              {incomeSource === 'employed' && (
                <div className="input-section">
                  <div className="label-row">
                    <span className="field-label">Monthly Net Income</span>
                    <span className="badge-hint">after tax</span>
                  </div>
                  <div className="input-wrapper">
                    <input type="text" inputMode="numeric" id="salaryIncome" className="input-field" placeholder="e.g., 100,000" autoComplete="off" />
                  </div>
                </div>
              )}

              {incomeSource === 'business' && (
                <div className="input-section">
                  <div className="label-row">
                    <span className="field-label">Monthly Business Turnover</span>
                    <span className="badge-hint">50% profit margin</span>
                  </div>
                  <input type="text" inputMode="numeric" id="businessIncome" className="input-field" placeholder="e.g., 1,000,000" autoComplete="off" />
                </div>
              )}

              <hr />

              {incomeSource !== 'employed' && (
                <div className="input-section">
                  <div className="label-row">
                    <span className="field-label">Rental Income / Credit Limits</span>
                  </div>
                  <input type="number" id="rentalPayment" className="input-field" placeholder="e.g., 1200" step="50" autoComplete="off" />
                </div>
              )}

              <div className="input-section">
                <div className="label-row">
                  <span className="field-label">Existing Monthly Obligations</span>
                  <span className="badge-hint">loans, credit cards</span>
                </div>
                <input type="text" inputMode="numeric" id="loanObligations" className="input-field" placeholder="e.g., 25,000" autoComplete="off" />
              </div>

              <hr />

              <div className="input-section">
                <div className="label-row">
                  <span className="field-label">Preferred Loan Tenor</span>
                  <span className="badge-hint">1–25 years</span>
                </div>
                <input type="number" id="loanTenor" className="input-field" placeholder="e.g., 20" min="1" max="25" step="1" autoComplete="off" />
                <div className="tenor-note">
                  <span>ⓘ</span> Enter a number between 1 and 25 (maximum 25 years)
                </div>
              </div>

              <button id="calculateTrigger" className="calc-btn">
                ✨ Calculate Eligibility
              </button>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="card-panel results-container">
            <div className="card-title">
              <span>📈</span> Your Loan Assessment
            </div>
            <div className="card-body">
              <div className="result-block highlight">
                <div className="result-label">Maximum Monthly Mortgage Payment</div>
                <div className="result-value" id="displayMonthly">Ksh 0</div>
                <div className="result-footnote">Principal + interest (based on qualifying income)</div>
              </div>

              <div className="result-block">
                <div className="result-label">Estimated Loan Amount</div>
                <div className="result-value" id="displayLoanAmount">Ksh 0</div>
                <div className="result-footnote" id="loanTenorText">Based on your selected tenor & illustrative rate</div>
              </div>

              <div className="result-block">
                <div className="result-label">Eligibility Breakdown</div>
                <div className="result-value" id="breakdownMonthly" style={{ fontSize: '1rem', fontWeight: 600 }}>—</div>
                <div className="result-footnote" id="breakdownDetails">Salary 60% + Business adj. + Rent credit – existing debts</div>
              </div>

              <div id="statusBadge" className="eligibility-chip">📋 Fill in your details</div>
              
              {(calculated && (hasResults || loanResultId)) && (
                <button type="button" className="callback-btn" onClick={handleOpenCallback}>
                  📞 Request a Callback
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="steps-row">
          <span>1️⃣ Enter your financial information</span>
          <span>2️⃣ We calculate your eligibility</span>
          <span>3️⃣ View your results instantly</span>
          <span>📌 Max loan tenor: 25 years</span>
        </div>

        <div className="legal-note">
          ⚠️ This is a preliminary qualification. Final approval requires full documentation and credit review.
        </div>
      </div>

      {showCallbackModal && (
        <CallbackRequestModal
          loanResultId={loanResultId}
          loanResponse={loanResponse}
          loanInputs={loanInputs}
          onClose={() => setShowCallbackModal(false)}
          onSuccess={() => setShowCallbackModal(false)}
        />
      )}
    </div>
  );
}