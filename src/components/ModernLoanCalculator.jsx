import React, { useEffect, useState } from 'react';
import CallbackRequestModal from './CallbackRequestModal';
import loanService from '../services/loanService';

// List of Kenyan towns for business location autocomplete
const KENYAN_TOWNS = [
  'Nairobi', 'Mombasa', 'Nakuru', 'Ruiru', 'Eldoret', 'Kisumu', 'Kikuyu', 'Ngong', 'Mavoko', 'Thika', 
  'Naivasha', 'Karuri', 'Kitale', 'Kiambu', 'Juja', 'Kitengela', 'Malindi', 'Mandera', 'Kisii', 'Kakamega', 
  'Mtwapa', 'Wajir', 'Lodwar', 'Limuru', 'Meru', 'Nyeri', 'Isiolo', 'Ukunda (Diani)', 'Kiserian', 'Kilifi', 
  'Nanyuki', 'Busia', 'Migori', 'Bungoma', 'Narok', 'Embu', 'Machakos', 'El Wak', 'Gilgil', 'Kimilili', 
  'Kericho', 'Voi', 'Wanguru', 'Habaswein', 'Turi', 'Moyale', 'Homa Bay', 'Kenol', 'Masalani', 'Muranga', 
  'Garissa', 'Kapenguria', 'Kitui', 'Marsabit', 'Nyahururu', 'Ol Kalou', 'Siaya', 'Taveta', 'Chuka', 
  'Kangundo-Tala', 'Molo', 'Awendo', 'Kehancha', 'Ahero', 'Kabarnet', 'Kapsabet', 'Kerugoya', 'Kijabe', 
  'Kinango', 'Kipkelion', 'Konza', 'Kwale', 'Lanet', 'Likoni', 'Loiyangalani', 'Lokoja', 'Luanda', 'Lugari', 
  'Madogo', 'Magadi', 'Makindu', 'Malaba', 'Malakisi', 'Mariakani', 'Marigat', 'Masii', 'Matuu', 'Maua', 
  'Mbale', 'Mbita', 'Merti', 'Migwani', 'Miritini', 'Mitunguu', 'Moi\'s Bridge', 'Mp Shah', 'Mumias', 'Mwingi', 
  'Namanga', 'Nandi Hills', 'Ndhiwa', 'Nkubu', 'Nuno', 'Nyamira', 'Nyando', 'Olenguruone', 'Oloitokitok', 'Oriwo', 
  'Oyugis', 'Pate', 'Port Victoria', 'Rabai', 'Rongo', 'Sabaki', 'Sare', 'Serem', 'Shimanzi', 'Shimoni', 'Sotik', 
  'Stoni Athi', 'Suba', 'Suneka', 'Tabaka', 'Takaba', 'Taru', 'Timbila', 'Tindiret', 'Tseikuru', 'Tsavo', 'Tula', 
  'Turbo', 'Ugunja', 'Ukwala', 'Vihiga', 'Webuye', 'Werugha', 'Witu', 'Wote', 'Yala', 'Ziwa'
];

// List of scheme companies (to be updated with actual company list)
const SCHEME_COMPANIES = [
  // Placeholder - will be populated with actual scheme companies
];

export default function ModernLoanCalculator({ selectedProduct, onChangeProduct }) {
  // Product type: 'affordableHousing' or 'stdMortgage'
  // Initialize based on selectedProduct prop
  const initialLoanType = selectedProduct?.id === 'ahf' ? 'affordableHousing' : (selectedProduct?.id === 'standard' ? 'stdMortgage' : 'affordableHousing');
  const [loanType, setLoanType] = useState(initialLoanType);
  // Income source type: 'employed' or 'business' (only applicable for affordableHousing)
  const [incomeSource, setIncomeSource] = useState('employed');
  const [employerSelectionMode, setEmployerSelectionMode] = useState('scheme'); // 'scheme' or 'other'
  const [employerOtherInput, setEmployerOtherInput] = useState('');
  const [idNumber, setIdNumber] = useState(''); // ID number for credit score integration
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [loanResultId, setLoanResultId] = useState(null);
  const [loanResponse, setLoanResponse] = useState(null);
  const [loanInputs, setLoanInputs] = useState(null);

  useEffect(() => {
    // Mirror the original script: DOM-driven logic for exact visual parity
    const salaryEl = () => document.getElementById('salaryIncome');
    const businessEl = () => document.getElementById('businessIncome');
    // rental input removed per requirements
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
      let num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    }

    const creditCardEl = () => document.getElementById('creditCardLimit');
    const overdraftEl = () => document.getElementById('overdraftLimit');

    function calculateLoanFromEmi(monthlyPayment, years, annualRatePercent) {
      if (monthlyPayment <= 0 || years <= 0) return 0;
      const monthlyRate = annualRatePercent / 100 / 12;
      const months = years * 12;
      if (monthlyRate === 0) return monthlyPayment * months;
      const growth = Math.pow(1 + monthlyRate, months);
      return monthlyPayment * ((growth - 1) / (monthlyRate * growth));
    }

    function calculateEmiFromPrincipal(principal, years, annualRatePercent) {
      if (principal <= 0 || years <= 0) return 0;
      const monthlyRate = annualRatePercent / 100 / 12;
      const months = years * 12;
      if (monthlyRate === 0) return principal / months;
      const growth = Math.pow(1 + monthlyRate, months);
      return principal * ((monthlyRate * growth) / (growth - 1));
    }

    function normalizeRatePercent(value) {
      if (value === null || value === undefined || Number.isNaN(Number(value))) return null;
      const numeric = Number(value);
      return numeric > 0 && numeric < 1 ? numeric * 100 : numeric;
    }

    function formatKES(value) {
      return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    }

    function buildLocalCalculation() {
      const salary = getNumericValue(salaryEl());
      const business = getNumericValue(businessEl());
      const existingLoanObligations = getNumericValue(obligationsEl());
      const creditCardLimit = getNumericValue(creditCardEl());
      const overdraftLimit = getNumericValue(overdraftEl());
      const tenorYears = Math.max(1, Math.min(25, getNumericValue(tenorEl()) || 1));
      const cardObligation = creditCardLimit * 0.10;
      const odObligation = overdraftLimit * 0.05;
      const existingObligations = existingLoanObligations + cardObligation + odObligation;

      if (loanType === 'stdMortgage') {
        const dirCap = salary * 0.60;
        const availableEMI = dirCap - existingObligations;

        if (availableEMI <= 0) {
          return {
            qualifies: false,
            message: 'Existing obligations exceed 60% DIR',
            maximumLoanAmount: 0,
            estimatedMonthlyRepayment: 0,
            appliedInterestRate: 14.02,
            loanTenorMonths: tenorYears * 12,
            netMonthlyIncome: salary,
            existingObligations,
            dbrCap40Percent: dirCap,
            availableEMI,
            dbrUsedPercent: salary > 0 ? `${(((existingObligations + Math.max(0, availableEMI)) / salary) * 100).toFixed(1)}%` : null,
            assumptions: `Std Mortgage: DIR=60%, Rate=14.02%, Tenor=${tenorYears}yrs`,
            cappingApplied: false,
          };
        }

        return {
          qualifies: true,
          maximumLoanAmount: Math.round(calculateLoanFromEmi(availableEMI, tenorYears, 14.02)),
          estimatedMonthlyRepayment: Math.round(availableEMI),
          appliedInterestRate: 14.02,
          loanTenorMonths: tenorYears * 12,
          adjustedIncome: salary,
          netMonthlyIncome: salary,
          existingObligations,
          dbrCap40Percent: dirCap,
          availableEMI,
          dbrUsedPercent: salary > 0 ? `${(((existingObligations + availableEMI) / salary) * 100).toFixed(1)}%` : null,
          assumptions: `Std Mortgage: DIR=60%, Rate=14.02%, Tenor=${tenorYears}yrs`,
          cappingApplied: false,
        };
      }

      if (incomeSource === 'business') {
        const netIncome = business * 0.50;
        const dbrCap = netIncome * 0.40;
        const availableEMI = dbrCap - existingObligations;
        const annualRate = business < 2000000 ? 9.5 : 9.9;

        if (availableEMI <= 0) {
          return {
            qualifies: false,
            message: 'Existing obligations exceed 40% of income',
            maximumLoanAmount: 0,
            estimatedMonthlyRepayment: 0,
            appliedInterestRate: annualRate,
            loanTenorMonths: tenorYears * 12,
            adjustedIncome: Math.round(netIncome),
            netMonthlyIncome: Math.round(netIncome),
            existingObligations,
            dbrCap40Percent: dbrCap,
            availableEMI,
            assumptions: `Affordable Business: ProfitMargin=50%, DBR=40%, Rate=${annualRate}%, Tenor=${tenorYears}yrs`,
            cappingApplied: false,
          };
        }

        const calculatedLoanBeforeCap = calculateLoanFromEmi(availableEMI, tenorYears, annualRate);
        const cappingApplied = calculatedLoanBeforeCap > 10500000;
        const maximumLoanAmount = cappingApplied ? 10500000 : Math.round(calculatedLoanBeforeCap);
        const estimatedMonthlyRepayment = cappingApplied
          ? Math.round(calculateEmiFromPrincipal(maximumLoanAmount, tenorYears, annualRate))
          : Math.round(availableEMI);

        return {
          qualifies: true,
          maximumLoanAmount,
          estimatedMonthlyRepayment,
          appliedInterestRate: annualRate,
          loanTenorMonths: tenorYears * 12,
          adjustedIncome: Math.round(netIncome),
          netMonthlyIncome: Math.round(netIncome),
          existingObligations,
          dbrCap40Percent: dbrCap,
          availableEMI,
          cappingApplied,
          calculatedLoanBeforeCap: Math.round(calculatedLoanBeforeCap),
          message: cappingApplied ? 'Loan amount capped to policy maximum of KES 10,500,000' : null,
          assumptions: `Affordable Business: ProfitMargin=50%, DBR=40%, Rate=${annualRate}%, Tenor=${tenorYears}yrs`,
        };
      }

      const maxNetIncome = 658279.65;
      if (salary > maxNetIncome) {
        return {
          qualifies: false,
          message: `Net income exceeds maximum allowed of ${maxNetIncome.toFixed(2)}`,
          maximumLoanAmount: 0,
          estimatedMonthlyRepayment: 0,
          loanTenorMonths: tenorYears * 12,
          adjustedIncome: salary,
          netMonthlyIncome: salary,
          assumptions: `Affordable Employed: DIR=60%, MaxIncome=${maxNetIncome.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        };
      }

      const dirCap = salary * 0.60;
      const availableEMI = dirCap - existingObligations;
      const annualRate = tenorYears <= 20 ? 9.5 : 9.9;

      if (availableEMI <= 0) {
        return {
          qualifies: false,
          message: 'Existing obligations exceed 60% DIR',
          maximumLoanAmount: 0,
          estimatedMonthlyRepayment: 0,
          appliedInterestRate: annualRate,
          loanTenorMonths: tenorYears * 12,
          adjustedIncome: salary,
          netMonthlyIncome: salary,
          existingObligations,
          dbrCap40Percent: dirCap,
          availableEMI,
          dbrUsedPercent: salary > 0 ? `${(((existingObligations + Math.max(0, availableEMI)) / salary) * 100).toFixed(1)}%` : null,
          assumptions: `Affordable Employed: DIR=60%, Rate=${annualRate}%, Tenor=${tenorYears}yrs`,
          cappingApplied: false,
        };
      }

      const calculatedLoanBeforeCap = calculateLoanFromEmi(availableEMI, tenorYears, annualRate);
      const cappingApplied = calculatedLoanBeforeCap > 10500000;
      const maximumLoanAmount = cappingApplied ? 10500000 : Math.round(calculatedLoanBeforeCap);
      const estimatedMonthlyRepayment = cappingApplied
        ? Math.round(calculateEmiFromPrincipal(maximumLoanAmount, tenorYears, annualRate))
        : Math.round(availableEMI);

      return {
        qualifies: true,
        maximumLoanAmount,
        estimatedMonthlyRepayment,
        appliedInterestRate: annualRate,
        loanTenorMonths: tenorYears * 12,
        adjustedIncome: salary,
        netMonthlyIncome: salary,
        existingObligations,
        dbrCap40Percent: dirCap,
        availableEMI,
        dbrUsedPercent: salary > 0 ? `${(((existingObligations + availableEMI) / salary) * 100).toFixed(1)}%` : null,
        cappingApplied,
        calculatedLoanBeforeCap: Math.round(calculatedLoanBeforeCap),
        message: cappingApplied ? 'Loan amount capped to policy maximum of KES 10,500,000' : null,
        assumptions: `Affordable Employed: DIR=60%, MaxIncome=658,279.65, Rate=${annualRate}%, Tenor=${tenorYears}yrs`,
      };
    }

    function renderCalculationResult(result, fallbackTenorYears) {
      const monthlyValue = Math.round(result?.estimatedMonthlyRepayment || 0);
      const loanValue = Math.round(result?.maximumLoanAmount || 0);
      const obligationsValue = Math.round(result?.existingObligations || 0);
      const capValue = Math.round(result?.dbrCap40Percent || 0);
      const emiValue = Math.round(result?.availableEMI || 0);
      const netIncomeValue = Math.round(result?.netMonthlyIncome || result?.adjustedIncome || 0);
      const beforeCapValue = Math.round(result?.calculatedLoanBeforeCap || 0);
      const years = Math.round((result?.loanTenorMonths || 0) / 12) || fallbackTenorYears || 1;
      const apr = normalizeRatePercent(result?.appliedInterestRate);
      const qualifies = Boolean(result?.qualifies);

      if (monthlyResultSpan) monthlyResultSpan.innerText = formatKES(monthlyValue);
      if (loanAmountSpan) loanAmountSpan.innerText = formatKES(loanValue);
      if (breakdownMonthlySpan) breakdownMonthlySpan.innerText = formatKES(emiValue);

      if (breakdownDetailsSpan) {
        const lines = [];
        if (loanType === 'stdMortgage') {
          lines.push(`Net income: ${formatKES(netIncomeValue)}`);
          lines.push(`DIR cap (60%): ${formatKES(capValue)}`);
        } else if (incomeSource === 'business') {
          lines.push(`Net income after 50% profit margin: ${formatKES(netIncomeValue)}`);
          lines.push(`DBR cap (40%): ${formatKES(capValue)}`);
        } else {
          lines.push(`Net income: ${formatKES(netIncomeValue)}`);
          lines.push(`DIR cap (60%): ${formatKES(capValue)}`);
        }
        lines.push(`Existing obligations incl. card/OD: -${formatKES(obligationsValue)}`);
        lines.push(`Available EMI: ${formatKES(emiValue)}`);
        if (beforeCapValue > 0) lines.push(`Loan before cap: ${formatKES(beforeCapValue)}`);
        if (result?.cappingApplied) lines.push('<strong>Policy cap applied: KES 10,500,000</strong>');
        if (result?.message && !qualifies) lines.push(`<strong>${result.message}</strong>`);
        breakdownDetailsSpan.innerHTML = lines.join('<br>');
      }

      if (loanTenorTextSpan) {
        const rateText = apr !== null ? `${apr}% APR` : 'Rate unavailable';
        const capText = result?.cappingApplied ? ' · capped at KES 10,500,000' : '';
        loanTenorTextSpan.innerHTML = `${years} year term · ${rateText}${capText}`;
      }

      if (statusBadge) {
        if (!qualifies && !(netIncomeValue || obligationsValue || emiValue || loanValue)) {
          statusBadge.innerHTML = '📋 Enter your financial info to see eligibility';
          statusBadge.style.background = '#eef2f7';
          statusBadge.style.color = '#5d7e96';
        } else if (!qualifies) {
          statusBadge.innerHTML = `⚠️ ${result?.message || 'Does not qualify'}`;
          statusBadge.style.background = '#fee9e6';
          statusBadge.style.color = '#b13e3e';
        } else if (result?.cappingApplied) {
          statusBadge.innerHTML = '✅ Qualifies — policy cap applied';
          statusBadge.style.background = '#fff0e0';
          statusBadge.style.color = '#b45f1b';
        } else {
          statusBadge.innerHTML = '✅ Qualifies based on backend rules';
          statusBadge.style.background = '#e0f0e8';
          statusBadge.style.color = '#1a6e4a';
        }
      }
    }

    function refreshCalculation() {
      const tenorElement = tenorEl();
      let tenorYears = getNumericValue(tenorElement);
      if (tenorYears < 1 || isNaN(tenorYears)) tenorYears = 1;
      if (tenorYears > 25) tenorYears = 25;
      renderCalculationResult(buildLocalCalculation(), tenorYears);
    }

    function enforceTenorConstraints() {
      const t = tenorEl();
      if (!t) return;
      let val = (t.value || '').toString().trim();
      if (val === '') return;
      let num = parseFloat(val);
      if (isNaN(num)) { t.value = ''; if (calculated) refreshCalculation(); return; }
      if (num < 1) t.value = '1';
      else if (num > 25) t.value = '25';
      if (calculated) refreshCalculation();
    }

    // Use the implemented refreshCalculation function above
    // Bind events to actual DOM elements (call getters)
    const inputs = [salaryEl(), businessEl(), obligationsEl(), creditCardEl(), overdraftEl(), tenorEl(), document.getElementById('employerName'), document.getElementById('natureOfBusiness'), document.getElementById('businessLocation')];
    inputs.forEach(input => {
      if (!input || typeof input.addEventListener !== 'function') return;
      const onInput = () => { try { if (!calculated) return; refreshCalculation(); } catch (e) { console.error(e); } };
      const onBlur = () => { try { if (input === tenorEl()) enforceTenorConstraints(); if (!calculated) return; refreshCalculation(); } catch (e) { console.error(e); } };
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
        const hasIncome = (s > 0) || (b > 0);

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
            // rental removed
            existingLoanObligations: getNumericValue(obligationsEl()),
            creditCardLimit: getNumericValue(creditCardEl()),
            overdraftLimit: getNumericValue(overdraftEl()),
            productType: loanType,
            incomeSourceType: incomeSource,
            preferredLoanTenorYears: parseInt((tenorEl() && (tenorEl().value || '').toString().trim()) || '1', 10),
            employerName: (document.getElementById('employerNameHidden')?.value || '').trim(),
            natureOfBusiness: (document.getElementById('natureOfBusiness')?.value || '').trim(),
            businessLocation: (document.getElementById('businessLocation')?.value || '').trim(),
            idNumber: (document.getElementById('idNumber')?.value || '').trim()
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
                let apr = normalizeRatePercent(resp.appliedInterestRate || resp.AppliedInterestRate || null);
                loanTenorTextSpan.innerHTML = `${years} year term · ${apr}% APR${resp.cappingApplied || resp.CappingApplied ? ' · capped at KES 10,500,000' : ''}`;
              }
            } catch {}
            try { renderCalculationResult(resp, payload.preferredLoanTenorYears); } catch {}
            try {
              const estimatedLoan = Math.round(resp.maximumLoanAmount || resp.MaximumLoanAmount || 0);
              const monthlyPayment = Math.round(resp.estimatedMonthlyRepayment || resp.EstimatedMonthlyRepayment || 0);
              window.dispatchEvent(new CustomEvent('loanCalcCalculated', { detail: { estimatedLoan, monthlyPayment } }));
              setHasResults(Boolean(estimatedLoan || monthlyPayment));
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
    if (obligationsEl()) obligationsEl().value = '';
    if (creditCardEl()) creditCardEl().value = '';
    if (overdraftEl()) overdraftEl().value = '';
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
  }, [incomeSource, loanType]);

  useEffect(() => {
    const handler = (ev) => {
      const estimated = Number(ev?.detail?.estimatedLoan) || 0;
      if (estimated > 0) setHasResults(true);
      else setHasResults(false);
    };
    window.addEventListener('loanCalcCalculated', handler);
    return () => window.removeEventListener('loanCalcCalculated', handler);
  }, []);

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
      const n = parseFloat(v);
      return isNaN(n) ? 0 : n;
    };

    const s = getElValue('salaryIncome');
    const b = getElValue('businessIncome');
    const payload = {
      monthlySalaryIncome: s,
      monthlyBusinessIncome: b,
      // rental removed
      existingLoanObligations: getElValue('loanObligations'),
      creditCardLimit: getElValue('creditCardLimit'),
      overdraftLimit: getElValue('overdraftLimit'),
      productType: loanType,
      incomeSourceType: incomeSource,
      preferredLoanTenorYears: parseInt((document.getElementById('loanTenor')?.value || '1').toString().trim(), 10) || 1,
      employerName: (document.getElementById('employerNameHidden')?.value || '').trim(),
      natureOfBusiness: (document.getElementById('natureOfBusiness')?.value || '').trim(),
      businessLocation: (document.getElementById('businessLocation')?.value || '').trim(),
      idNumber: (document.getElementById('idNumber')?.value || '').trim()
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
    const employerNameDropdownEl = document.getElementById('employerNameDropdown');
    const employerNameInputEl = document.getElementById('employerNameInput');
    const natureOfBusinessEl = document.getElementById('natureOfBusiness');
    const businessLocationEl = document.getElementById('businessLocation');
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
      if (natureOfBusinessEl) natureOfBusinessEl.value = '';
      if (businessLocationEl) businessLocationEl.value = '';
      // Reset employer selection
      if (employerNameDropdownEl) employerNameDropdownEl.value = '';
      if (employerNameInputEl) employerNameInputEl.value = '';
      setEmployerSelectionMode('scheme');
      setEmployerOtherInput('');
    }
    if (incomeSource === 'business') {
      if (salaryEl) salaryEl.value = '';
      if (employerNameDropdownEl) employerNameDropdownEl.value = '';
      if (employerNameInputEl) employerNameInputEl.value = '';
      setEmployerSelectionMode('scheme');
      setEmployerOtherInput('');
      setIdNumber('');
    }

    // Clear displayed results when switching
    if (monthlyResultSpan) monthlyResultSpan.innerText = 'Ksh 0';
    if (loanAmountSpan) loanAmountSpan.innerText = 'Ksh 0';
    if (breakdownMonthlySpan) breakdownMonthlySpan.innerText = '—';
    if (breakdownDetailsSpan) breakdownDetailsSpan.innerText = 'Net income, obligations, cap, and available EMI will appear here';
    if (statusBadge) {
      statusBadge.innerHTML = '📋 Fill in your details';
      statusBadge.style.background = '#eef2f7';
      statusBadge.style.color = '#5d7e96';
    }
  }, [incomeSource, loanType]);

  // Update hidden employer name input whenever employer selection changes
  useEffect(() => {
    const hiddenEmployerInput = document.getElementById('employerNameHidden');
    if (hiddenEmployerInput) {
      if (employerSelectionMode === 'other') {
        hiddenEmployerInput.value = employerOtherInput;
      } else {
        const dropdownEl = document.getElementById('employerNameDropdown');
        if (dropdownEl && dropdownEl.value && dropdownEl.value !== 'OTHER') {
          hiddenEmployerInput.value = dropdownEl.value;
        } else {
          hiddenEmployerInput.value = '';
        }
      }
    }
  }, [employerSelectionMode, employerOtherInput]);

  // Render the exact HTML + CSS provided by the user (converted to JSX)
  return (
    <div>
      {/* Loan Type Selection */}
      <div className="loan-type-select" style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', alignItems: 'center', justifyContent: 'center' }}>
        <label style={{ fontWeight: 600, fontSize: '1.1rem', color: '#1a2c3e' }}>
          <input type="radio" name="loanType" value="affordableHousing" checked={loanType === 'affordableHousing'} disabled />
        </label>
        <label style={{ fontWeight: 600, fontSize: '1.1rem', color: '#1a2c3e' }}>
          <input type="radio" name="loanType" value="stdMortgage" checked={loanType === 'stdMortgage'} disabled /> 
        </label>
      </div>
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

    /* Income source selector */
    .income-source {
      display:flex;
      gap:0.6rem;
      align-items:center;
      margin-bottom:1rem;
    }
    .income-source label{ display:flex; gap:0.5rem; align-items:center; font-weight:600; color:#123542; font-size:0.95rem; }
    .income-source input[type="radio"]{ accent-color:#1f6e8c; }

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
          {onChangeProduct && (
            <button 
              onClick={onChangeProduct}
              style={{
                marginTop: '1rem',
                padding: '0.6rem 1.2rem',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#1f6e8c',
                background: '#f0f8fb',
                border: '1px solid #b3d9ea',
                borderRadius: '0.6rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.background = '#e1f0f7'}
              onMouseOut={(e) => e.target.style.background = '#f0f8fb'}
            >
              ↶ Change Product
            </button>
          )}
        </div>

        <div className="form-grid">
          <div className="card-panel">
            <div className="card-title"><span>📋</span> Income & Obligations</div>
            <div className="card-body">
              <div className="input-section">

                <div className="income-source" role="radiogroup" aria-label="Source of income">
                  {/* For Affordable Housing, show both options. For Std Mortgage, only show Employed. */}
                  <label><input type="radio" name="incomeSource" value="employed" checked={incomeSource==='employed'} onChange={() => setIncomeSource('employed')} /> Employed</label>
                  {loanType === 'affordableHousing' && (
                    <label><input type="radio" name="incomeSource" value="business" checked={incomeSource==='business'} onChange={() => setIncomeSource('business')} /> Business</label>
                  )}
                </div>

                  {incomeSource === 'employed' && (
                    <>
                      <div className="label-row">
                        <span className="field-label">Monthly Salary Income</span>
                        <span className="badge-hint"></span>
                      </div>
                      <div className="input-wrapper">
                        <input type="number" id="salaryIncome" className="input-field" placeholder="e.g., 4500" step="100" autoComplete="off" />
                      </div>
                      <div className="input-section">
                        <div className="label-row">
                          <span className="field-label">Employer Name</span>
                          <span className="badge-hint">Your current employer</span>
                        </div>
                        <select 
                          id="employerNameDropdown" 
                          className="input-field"
                          value={employerSelectionMode === 'other' ? 'OTHER' : (employerSelectionMode === 'scheme' && employerOtherInput ? employerOtherInput : '')}
                          onChange={(e) => {
                            if (e.target.value === 'OTHER') {
                              setEmployerSelectionMode('other');
                              setEmployerOtherInput('');
                            } else {
                              setEmployerSelectionMode('scheme');
                              setEmployerOtherInput(e.target.value);
                            }
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <option value="">-- Select your employer --</option>
                          {SCHEME_COMPANIES.length > 0 ? (
                            <>
                              {SCHEME_COMPANIES.map((company) => (
                                <option key={company} value={company}>
                                  {company}
                                </option>
                              ))}
                              <option value="OTHER">Others (Please specify below)</option>
                            </>
                          ) : (
                            <option value="OTHER">Others (Please specify below)</option>
                          )}
                        </select>
                        {employerSelectionMode === 'other' && (
                          <input 
                            type="text" 
                            id="employerName" 
                            className="input-field" 
                            placeholder="e.g., NCBA Group PLC" 
                            autoComplete="off"
                            value={employerOtherInput}
                            onChange={(e) => setEmployerOtherInput(e.target.value)}
                            style={{ marginTop: '0.8rem' }}
                          />
                        )}
                        {/* Hidden input to store final employer name for submission */}
                        <input type="hidden" id="employerNameHidden" value="" />
                      </div>
                      <div className="input-section">
                        <div className="label-row">
                          <span className="field-label">ID Number</span>
                          <span className="badge-hint"></span>
                        </div>
                        <input 
                          type="text" 
                          id="idNumber" 
                          className="input-field" 
                          placeholder="e.g., 12345678" 
                          autoComplete="off"
                          value={idNumber}
                          onChange={(e) => setIdNumber(e.target.value)}
                        />
                      </div>
                    </>
                  )}
              </div>
                {incomeSource === 'business' && (
                  <>
                    <div className="input-section">
                      <div className="label-row">
                        <span className="field-label">Monthly Business Income</span>
                        <span className="badge-hint"></span>
                      </div>
                      <input type="number" id="businessIncome" className="input-field" placeholder="e.g., 2200" step="100" autoComplete="off" />
                    </div>
                    <div className="input-section">
                      <div className="label-row">
                        <span className="field-label">Nature of Business</span>
                        <span className="badge-hint">Type of business you operate</span>
                      </div>
                      <input type="text" id="natureOfBusiness" className="input-field" placeholder="e.g., Retail, Consultancy, Manufacturing" autoComplete="off" />
                    </div>
                    <div className="input-section">
                      <div className="label-row">
                        <span className="field-label">Business Location</span>
                        <span className="badge-hint">Where your business is based</span>
                      </div>
                      <input 
                        type="text" 
                        id="businessLocation" 
                        className="input-field" 
                        placeholder="e.g., Nairobi" 
                        autoComplete="off" 
                        list="townsList"
                      />
                      <datalist id="townsList">
                        {KENYAN_TOWNS.map((town) => (
                          <option key={town} value={town} />
                        ))}
                      </datalist>
                    </div>
                  </>
                )}

              <hr />

              {/* Rental input removed */}
              <div className="input-section">
                <div className="label-row">
                  <span className="field-label">Credit Card Limit</span>
                  <span className="badge-hint"></span>
                </div>
                <input type="number" id="creditCardLimit" className="input-field" placeholder="e.g., 20000" step="100" autoComplete="off" />
              </div>

              <div className="input-section">
                <div className="label-row">
                  <span className="field-label">Overdraft Limit</span>
                  <span className="badge-hint"></span>
                </div>
                <input type="number" id="overdraftLimit" className="input-field" placeholder="e.g., 5000" step="50" autoComplete="off" />
              </div>

              <div className="input-section">
                <div className="label-row">
                  <span className="field-label">Existing Monthly Loan Obligations</span>
                  <span className="badge-hint">Car loans, credit cards, etc.</span>
                </div>
                <input type="number" id="loanObligations" className="input-field" placeholder="e.g., 400" step="50" autoComplete="off" />
              </div>

              <hr />

              <div className="input-section">
                <div className="label-row">
                  <span className="field-label">Preferred Loan Tenor (Years)</span>
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
                <div className="result-label">🏦 MONTHLY INSTALMENT</div>
                <div className="result-value" id="displayMonthly">Ksh 0</div>
                <div className="result-footnote">Matches the backend result for the selected product</div>
              </div>

              <div className="result-block">
                <div className="result-label">🏡 MAXIMUM LOAN AMOUNT</div>
                <div className="result-value" id="displayLoanAmount">Ksh 0</div>
                <div className="result-footnote" id="loanTenorText">Based on backend calculation rules</div>
              </div>

                <div className="result-block">
                <div className="result-label">📊 AVAILABLE EMI</div>
                <div className="result-value" id="breakdownMonthly" style={{ fontSize: '1.2rem', fontWeight: 700 }}>—</div>
                <div className="result-footnote" id="breakdownDetails">Net income, obligations, cap, and available EMI will appear here</div>
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