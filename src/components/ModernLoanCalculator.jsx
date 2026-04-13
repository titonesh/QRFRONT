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
      const businessPortion = business * 0.15; // 25% discount then 20% usable
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
      // Per pseudocode: 9.5% if <2,000,000 else 9.9%
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

      // If user selected Employed only, use DBR=60% and employed-specific formula per backend
      let estimatedLoan = 0;
      let roundedMonthly = 0;
      let breakdownHtml = '';
      let totalAvailable = 0;
      let salaryPortion = 0;
      let businessPortion = 0;
      let maxMonthly = 0;

      let appliedInterestRate = 5.75; // percent
      if (incomeSource === 'employed') {
        const netMonthlyIncome = salary;
        const dbrCap = netMonthlyIncome * 0.60; // 60% DBR for employed
        const availableEMI = dbrCap - obligations;
        totalAvailable = dbrCap + rental; // for employed, total available is DBR cap (rental should be 0)

        roundedMonthly = Math.max(0, Math.round(availableEMI));

        if (monthlyResultSpan) monthlyResultSpan.innerText = formatKES(roundedMonthly);

        if (availableEMI <= 0) {
          // Does not qualify
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
          // Determine interest rate based on tenor years
          const tenorYears = Math.max(1, effectiveTenor);
          const annualRate = tenorYears <= 20 ? 9.5 : 9.9;
          appliedInterestRate = annualRate;
          const monthlyRate = (annualRate / 100) / 12;
          const n = tenorYears * 12;

          // Loan amount using annuity inversion: P = M * [(1+r)^n - 1] / [r(1+r)^n]
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
        // existing blended/business logic
        // If purely business (no salary), follow pseudocode: rental is treated as an obligation
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
          // business/blended flow uses illustrative 5.75% APR unless API overrides
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

    // Use the implemented refreshCalculation function above
    // Bind events to actual DOM elements (call getters)
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
      // store handlers for cleanup
      input._onInput = onInput;
      input._onBlur = onBlur;
    });

    if (calcButton) {
      const onClick = async (e) => {
        e.preventDefault();
        // mark as calculated so future input changes update results
        setCalculated(true);
        enforceTenorConstraints();
        // run local refresh immediately for snappy UI
        refreshCalculation();

        // determine whether user provided any income fields
        const s = getNumericValue(salaryEl());
        const b = getNumericValue(businessEl());
        const r = incomeSource === 'employed' ? 0 : getNumericValue(rentEl());
        const hasIncome = (s > 0) || (b > 0) || (r > 0);

        // read displayed loan amount and monthly to include in the event detail
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
          // Also consider displayed monthly or estimated values to decide showing callback button
          const displayedMonthlyText = (monthlyResultSpan && monthlyResultSpan.innerText) ? monthlyResultSpan.innerText : '';
          const displayedMonthlyNum = Number(displayedMonthlyText.replace(/[^0-9.-]+/g, '')) || 0;
          const shouldShow = hasIncome || estimated > 0 || displayedMonthlyNum > 0;
          setHasResults(shouldShow);
          window.dispatchEvent(new CustomEvent('loanCalcCalculated', { detail: { estimatedLoan: estimated, monthlyPayment: monthly } }));
        } catch (err) {}

            // Persist calculation server-side so callbacks can reference a LoanResult
          try {
          const payload = {
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
            // Update displayed values from server response (more authoritative)
            try { if (monthlyResultSpan) monthlyResultSpan.innerText = formatKES(Math.round(resp.estimatedMonthlyRepayment || resp.EstimatedMonthlyRepayment || 0)); } catch {}
            try { if (loanAmountSpan) loanAmountSpan.innerText = formatKES(Math.round(resp.maximumLoanAmount || resp.MaximumLoanAmount || 0)); } catch {}
            try {
              if (loanTenorTextSpan) {
                const years = Math.round((resp.loanTenorMonths || resp.LoanTenorMonths || 0) / 12) || payload.preferredLoanTenorYears;
                // appliedInterestRate may be expressed as decimal (0.095) or percent (9.5). Normalize to percent.
                let apr = resp.appliedInterestRate || resp.AppliedInterestRate || resp.appliedinterestRate || resp.AppliedInterestRate || null;
                if (apr === null || apr === undefined) {
                  // fall back to deterministic business rule when server does not provide APR
                  apr = determineBusinessApr(payload.monthlyBusinessIncome || payload.monthlyBusinessIncome || 0);
                } else if (apr > 0 && apr < 1) apr = apr * 100;
                loanTenorTextSpan.innerHTML = `${years} year term · Est. rate ${apr}% APR (illustrative) · P&I only.`;
              }
            } catch {}
          }
        } catch (apiErr) {
          // swallow; we still allow local preview, but callbacks won't be linked until successful server save
          console.warn('Calculate API failed', apiErr);
        }

        calcButton.style.transform = 'scale(0.97)';
        setTimeout(() => { calcButton.style.transform = ''; }, 150);
      };
      calcButton.addEventListener('click', onClick);
      calcButton._onClick = onClick;
    }

    // initial clear (do not auto-run calculation until user clicks "Calculate")
    if (salaryEl()) salaryEl().value = '';
    if (businessEl()) businessEl().value = '';
    if (rentEl()) rentEl().value = '';
    if (obligationsEl()) obligationsEl().value = '';
    if (tenorEl()) tenorEl().value = '';
    // do not run calculation automatically on mount

    return () => {
      // cleanup listeners
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

  // Attempt to open callback modal; ensure there's a persisted LoanResultId first
  async function handleOpenCallback() {
    if (loanResultId) {
      setShowCallbackModal(true);
      return;
    }

    // collect input values from DOM (mirror calculate payload)
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

  // When income source changes, clear the hidden input so it's not included in calculations
  useEffect(() => {
    const salaryEl = document.getElementById('salaryIncome');
    const businessEl = document.getElementById('businessIncome');
    const rentEl = document.getElementById('rentalPayment');
    // When switching income source clear related inputs and reset calculation state
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

    // Clear displayed results when switching
    if (monthlyResultSpan) monthlyResultSpan.innerText = 'Ksh 0';
    if (loanAmountSpan) loanAmountSpan.innerText = 'Ksh 0';
    if (breakdownMonthlySpan) breakdownMonthlySpan.innerText = '—';
    if (breakdownDetailsSpan) breakdownDetailsSpan.innerText = 'Salary 60% + Business adj. + Rent credit – existing debts';
    if (statusBadge) {
      statusBadge.innerHTML = '📋 Fill in your details';
      statusBadge.style.background = '#eef2f7';
      statusBadge.style.color = '#5d7e96';
    }
  }, [incomeSource]);

  // Render the exact HTML + CSS provided by the user (converted to JSX)
  return (
    <div>
      <style>{`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background: linear-gradient(135deg, #f0f4fa 0%, #e2eaf3 100%);
      font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
      padding: 2rem 1.5rem;
      color: #1a2c3e;
      min-height: 100vh;
    }

    /* Main container */
    .loan-wrapper {
      max-width: 1280px;
      margin: 0 auto;
    }

    /* Header section */
    .brand-header {
      text-align: center;
      margin-bottom: 2.2rem;
    }

    .brand-header h1 {
      font-size: 2rem;
      font-weight: 700;
      background: linear-gradient(125deg, #1a4b63, #2c6e8f);
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      letter-spacing: -0.3px;
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }

    .brand-header p {
      color: #4a6f86;
      margin-top: 0.5rem;
      font-weight: 500;
      font-size: 0.95rem;
    }

    .product-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1.2rem;
      padding: 1rem 1.1rem;
      border-radius: 1.25rem;
      background: linear-gradient(135deg, rgba(0, 174, 239, 0.1), rgba(255, 255, 255, 0.95));
      border: 1px solid rgba(0, 174, 239, 0.16);
    }

    .product-step {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: #4a6f86;
      font-weight: 700;
      margin-bottom: 0.4rem;
    }

    .product-label {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.55rem 0.9rem;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.94);
      color: #123542;
      font-size: 0.95rem;
      font-weight: 700;
      box-shadow: 0 10px 25px -20px rgba(0, 50, 74, 0.4);
    }

    .product-change {
      border: 0;
      background: #ffffff;
      color: #165a78;
      border-radius: 999px;
      padding: 0.75rem 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 10px 24px -22px rgba(0, 50, 74, 0.6);
    }

    .product-change:hover {
      transform: translateY(-1px);
      background: #f4fbff;
    }

    /* Income source selector */
    .income-source {
      display:flex;
      gap:0.6rem;
      align-items:center;
      margin-bottom:1rem;
    }
    .income-source label{ display:flex; gap:0.5rem; align-items:center; font-weight:600; color:#123542; font-size:0.95rem; }
    .income-source input[type="radio"]{ accent-color:#1f6e8c; }

    .income-source-copy {
      margin-bottom: 0.9rem;
    }

    .income-source-copy p:first-child {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: #4a6f86;
      font-weight: 700;
      margin-bottom: 0.35rem;
    }

    .income-source-copy p:last-child {
      color: #1a2c3e;
      font-size: 1rem;
      font-weight: 600;
    }

    /* Grid layout */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.8rem;
      align-items: start;
    }

    /* Cards */
    .card-panel {
      background: rgba(255, 255, 255, 0.97);
      backdrop-filter: blur(0px);
      border-radius: 1.8rem;
      box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.02);
      overflow: hidden;
      transition: all 0.25s ease;
      border: 1px solid rgba(255,255,255,0.6);
    }

    .card-panel:hover {
      transform: translateY(-2px);
      box-shadow: 0 24px 40px -14px rgba(0, 0, 0, 0.15);
    }

    .card-title {
      padding: 1.3rem 1.8rem 0.7rem 1.8rem;
      font-weight: 650;
      font-size: 1.3rem;
      border-bottom: 2px solid #eef2f8;
      display: flex;
      align-items: center;
      gap: 10px;
      background: #ffffffcc;
      letter-spacing: -0.2px;
    }

    .card-title span:first-child {
      font-size: 1.5rem;
    }

    .card-body {
      padding: 1.6rem 1.8rem 2rem 1.8rem;
    }

    /* Form styling */
    .input-section {
      margin-bottom: 1.8rem;
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
      color: #1e4b61;
      font-size: 0.9rem;
    }

    .badge-hint {
      font-size: 0.7rem;
      background: #eff3f9;
      padding: 0.2rem 0.65rem;
      border-radius: 30px;
      color: #4f7e98;
      font-weight: 500;
    }

    .input-wrapper {
      width: 100%;
    }

    .input-field {
      width: 100%;
      padding: 0.85rem 1rem;
      font-size: 1rem;
      font-weight: 500;
      border: 1.5px solid #e0e9f0;
      border-radius: 1.2rem;
      background: #ffffff;
      transition: all 0.2s;
      font-family: inherit;
      color: #1f3f50;
    }

    .input-field:focus {
      outline: none;
      border-color: #3182a3;
      box-shadow: 0 0 0 3px rgba(49, 130, 163, 0.15);
    }

    .input-field::placeholder {
      color: #b9cedc;
      font-weight: 400;
    }

    hr {
      margin: 1.3rem 0;
      border: 0;
      height: 1px;
      background: linear-gradient(to right, #e2ecf5, transparent);
    }

    /* Tenor special */
    .tenor-note {
      font-size: 0.7rem;
      color: #6e8ea5;
      margin-top: 0.5rem;
      padding-left: 0.3rem;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Results area */
    .results-container {
      background: linear-gradient(125deg, #ffffff 0%, #fbfeff 100%);
    }

    .result-block {
      background: #f9fbfe;
      border-radius: 1.4rem;
      padding: 1rem 1.2rem;
      margin-bottom: 1.2rem;
      border: 1px solid #eef2f0;
      transition: all 0.2s;
    }

    .result-block.highlight {
      background: #eef6fc;
      border-left: 4px solid #2c8faf;
    }

    .result-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 700;
      color: #5c7f96;
      margin-bottom: 0.3rem;
    }

    .result-value {
      font-size: 2rem;
      font-weight: 800;
      color: #12455f;
      line-height: 1.2;
      word-break: break-word;
    }

    .result-footnote {
      font-size: 0.7rem;
      color: #6f90a5;
      margin-top: 0.3rem;
    }

    .eligibility-chip {
      display: inline-block;
      background: #e5f0f5;
      padding: 0.25rem 1rem;
      border-radius: 40px;
      font-size: 0.75rem;
      font-weight: 600;
      color: #1c6e8c;
      margin-top: 0.5rem;
    }

    /* CTA Button */
    .calc-btn {
      width: 100%;
      background: #1f6e8c;
      border: none;
      padding: 0.9rem;
      font-size: 1rem;
      font-weight: 600;
      color: white;
      border-radius: 2.2rem;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: 1rem;
      font-family: inherit;
      box-shadow: 0 3px 8px rgba(0,0,0,0.05);
      letter-spacing: 0.3px;
    }

    .calc-btn:hover {
      background: #0e5b78;
      transform: scale(0.98);
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
    }

    /* Info footers */
    .legal-note {
      margin-top: 1.8rem;
      font-size: 0.7rem;
      text-align: center;
      color: #68869b;
      background: #eef3f9;
      padding: 0.8rem;
      border-radius: 1.5rem;
      border-left: 3px solid #aacbdf;
    }

    .steps-row {
      margin-top: 2rem;
      background: #f3f7fc;
      border-radius: 1.8rem;
      padding: 1rem 1.8rem;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
      font-size: 0.85rem;
      font-weight: 500;
      color: #235f7a;
    }

    @media (max-width: 780px) {
      .form-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      .product-banner {
        flex-direction: column;
        align-items: flex-start;
      }
      body {
        padding: 1rem;
      }
      .result-value {
        font-size: 1.6rem;
      }
      .card-body {
        padding: 1.2rem;
      }
    }
  `}</style>

      <div className="loan-wrapper">
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

        <div className="income-source-copy">
          <p>Borrower Sector</p>
          <p>
            {isStandardMortgage
              ? 'Standard Mortgage is available for employed applicants only.'
              : 'Select the income segment to continue with the existing affordability flow.'}
          </p>
        </div>

        <div className="form-grid">
          <div className="card-panel">
            <div className="card-title"><span>📋</span> Income & Obligations</div>
            <div className="card-body">
              <div className="input-section">
                <div className="income-source" role="radiogroup" aria-label="Source of income">
                  <label><input type="radio" name="incomeSource" value="employed" checked={incomeSource==='employed'} onChange={() => setIncomeSource('employed')} /> Employed</label>
                  {!isStandardMortgage && (
                    <label><input type="radio" name="incomeSource" value="business" checked={incomeSource==='business'} onChange={() => setIncomeSource('business')} /> Business</label>
                  )}
                </div>

                  {incomeSource === 'employed' && (
                    <>
                      <div className="label-row">
                        <span className="field-label">💰 Monthly Net Income</span>
                        <span className="badge-hint"></span>
                      </div>
                      <div className="input-wrapper">
                        <input type="text" inputMode="numeric" id="salaryIncome" className="input-field" placeholder="e.g., 100,000" autoComplete="off" />
                      </div>
                    </>
                  )}
              </div>
                {incomeSource === 'business' && (
                  <div className="input-section">
                    <div className="label-row">
                      <span className="field-label">📊 Monthly Business Turnover</span>
                      <span className="badge-hint">20% after 25% discount</span>
                    </div>
                    <input type="text" inputMode="numeric" id="businessIncome" className="input-field" placeholder="e.g., 1,000,000" autoComplete="off" />
                  </div>
                )}

              <hr />

              {incomeSource !== 'employed' && (
                <div className="input-section">
                  <div className="label-row">
                    <span className="field-label">💳 Credit cards limits</span>
                    {/* <span className="badge-hint">Can contribute to affordability</span> */}
                  </div>
                  <input type="number" id="rentalPayment" className="input-field" placeholder="e.g., 1200" step="50" autoComplete="off" />
                </div>
              )}
              {/* Credit card and overdraft limits removed per UI requirements; treat as part of existing obligations */}

              <div className="input-section">
                <div className="label-row">
                  <span className="field-label">📉 Existing Monthly Loan Obligations</span>
                  <span className="badge-hint">Car loans, credit cards, etc.</span>
                </div>
                <input type="text" inputMode="numeric" id="loanObligations" className="input-field" placeholder="e.g., 25,000" autoComplete="off" />
              </div>

              <hr />

              <div className="input-section">
                <div className="label-row">
                  <span className="field-label">⏱️ Preferred Loan Tenor (Years)</span>
                  <span className="badge-hint">1–25 years max</span>
                </div>
                <input type="number" id="loanTenor" className="input-field" placeholder="e.g., 20" min="1" max="25" step="1" autoComplete="off" />
                <div className="tenor-note"><span>ⓘ</span> Enter a number between 1 and 25 (maximum 25 years)</div>
              </div>

              <button id="calculateTrigger" className="calc-btn">✨ Calculate eligibility ✨</button>
            </div>
          </div>

          <div className="card-panel results-container">
            <div className="card-title"><span>📈</span> Your Loan Assessment</div>
            <div className="card-body">
              <div className="result-block highlight">
                <div className="result-label">🏦 MAXIMUM MONTHLY MORTGAGE PAYMENT</div>
                <div className="result-value" id="displayMonthly">Ksh 0</div>
                <div className="result-footnote">Principal + interest (based on qualifying income)</div>
              </div>

              <div className="result-block">
                <div className="result-label">🏡 ESTIMATED LOAN AMOUNT</div>
                <div className="result-value" id="displayLoanAmount">Ksh 0</div>
                <div className="result-footnote" id="loanTenorText">Based on your selected tenor & illustrative rate</div>
              </div>

              <div className="result-block">
                <div className="result-label">📊 ELIGIBILITY BREAKDOWN</div>
                <div className="result-value" id="breakdownMonthly" style={{ fontSize: '1.2rem', fontWeight: 700 }}>—</div>
                <div className="result-footnote" id="breakdownDetails">Salary 60% + Business adj. + Rent credit – existing debts</div>
              </div>

              <div id="statusBadge" className="eligibility-chip">📋 Fill in your details</div>
              {(calculated && (hasResults || loanResultId)) && (
                <div style={{marginTop:12}}>
                  <button type="button" className="calc-btn" style={{background:'#ffffff', color:'#1f6e8c', border:'1px solid #cfe6ec'}} onClick={handleOpenCallback}>📞 Request callback</button>
                </div>
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

        <div className="legal-note">⚠️ This calculation is preliminary and not a final loan offer. Subject to verification, credit approval, and underwriting. This is a preliminary assessment and not a final approval.</div>
      {showCallbackModal && (
        <CallbackRequestModal
          loanResultId={loanResultId}
          loanResponse={loanResponse}
          loanInputs={loanInputs}
          onClose={() => setShowCallbackModal(false)}
          onSuccess={(d) => { setShowCallbackModal(false); }}
        />
      )}
      </div>
    </div>
  );
}
