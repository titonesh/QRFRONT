import { useEffect } from 'react';
import Card from './Card';
import ResultCard from './ResultCard';
import Button from './Button';

/**
 * LoanResultsDisplay Component
 * Shows the loan calculation results to the customer
 */
export const LoanResultsDisplay = ({ result, onProceed, onRequestCallback }) => {
  if (!result) {
    return null;
  }

  /**
   * Format currency values
   */
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      currencyDisplay: 'symbol',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  /**
   * Format percentage values
   */
  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  return (
    <div className="w-full">
      <Card className="overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-success to-primary text-white p-8 sm:p-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">Congratulations! 🎉</h2>
          <p className="text-lg sm:text-xl opacity-95">
            Your prequalification results are ready
          </p>
        </div>

        {/* Results Content */}
        <div className="p-8 sm:p-12 space-y-10">
          {/* Main Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Maximum Loan Amount Card */}
            <ResultCard
              variant="highlight"
              label="Maximum Loan Amount"
              value={formatCurrency(result.maximumLoanAmount)}
              subtitle="Based on your financial profile"
            />

            {/* Monthly Repayment Card */}
            <ResultCard
              variant="success"
              label="Estimated Monthly Instalment"
              value={formatCurrency(result.estimatedMonthlyRepayment)}
              subtitle={`Based on ${Math.round(result.loanTenorMonths / 12)}-year tenor · At ${formatPercentage(result.appliedInterestRate)}`}
            />

            {/* Stress-Tested Repayment Card */}
            <ResultCard
              variant="warning"
              label="Stress-Tested Monthly"
              value={formatCurrency(result.stressTestedRepayment)}
              subtitle={`At ${formatPercentage(result.appliedStressTestRate)}`}
            />
          </div>

          {/* Key Information */}
          <div className="border-t border-gray-200 pt-10">
            <h3 className="text-2xl sm:text-3xl font-bold mb-8">Prequalification Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600 font-semibold text-lg">Adjusted Affordability</span>
                  <span className="text-gray-900 font-bold text-lg">
                    {formatCurrency(result.adjustedIncome)}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600 font-semibold text-lg">Loan Tenor</span>
                  <span className="text-gray-900 font-bold text-lg">
                    {Math.round(result.loanTenorMonths / 12)} Years
                  </span>
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600 font-semibold text-lg">Interest Rate</span>
                  <span className="text-gray-900 font-bold text-lg">
                    {formatPercentage(result.appliedInterestRate)}
                  </span>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600 font-semibold text-lg">Payment with Stress Test</span>
                  <span className="text-gray-900 font-bold text-lg">
                    {formatCurrency(result.stressTestedRepayment)}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600 font-semibold text-lg">Stress Test Rate</span>
                  <span className="text-gray-900 font-bold text-lg">
                    {formatPercentage(result.appliedStressTestRate)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-semibold text-lg">Request ID</span>
                  <span className="text-gray-900 font-mono text-sm font-bold">
                    #{result.loanRequestId}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Assumptions */}
          <Card variant="outlined" className="border-l-4 border-primary bg-primary-light/10">
            <h4 className="text-lg font-bold text-primary mb-4 uppercase flex items-center gap-2">
              <span className="inline-block w-1 h-6 bg-primary rounded-full"></span>
              Calculation Assumptions
            </h4>
            <p className="text-base text-gray-700 leading-relaxed">
              {result.assumptions}
            </p>
          </Card>

          {/* Disclaimer */}
          <Card variant="warning" className="bg-warning-light/20">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-warning" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-base font-semibold text-gray-900 mb-2">Important Notice</p>
                <p className="text-sm text-gray-700">
                  This is a preliminary prequalification estimate. Final loan approval is subject to full documentation review, credit checks, and property appraisal. Interest rates and loan terms may vary based on final underwriting.
                </p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <Button
              onClick={onProceed}
              variant="primary"
              size="lg"
              className="flex-1"
            >
              Proceed with Application
            </Button>
            <Button
              onClick={onRequestCallback}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              Request Callback
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoanResultsDisplay;
