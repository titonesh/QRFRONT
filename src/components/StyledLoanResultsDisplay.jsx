import Button from './Button';
import Card from './Card';
import ResultCard from './ResultCard';

export default function StyledLoanResultsDisplay({ 
  result, 
  onCalculateAgain, 
  onRequestCallback 
}) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value) => {
    return (value * 100).toFixed(2) + '%';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Key Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ResultCard
          title="Maximum Loan Amount"
          value={formatCurrency(result.MaximumLoanAmount)}
          subtitle="What you can borrow"
          highlight
          icon="💰"
        />
        <ResultCard
          title="Monthly Repayment"
          value={formatCurrency(result.EstimatedMonthlyRepayment)}
          subtitle="At current rates"
          icon="📅"
        />
        <ResultCard
          title="Stress-Tested Payment"
          value={formatCurrency(result.StressTestedRepayment)}
          subtitle="At higher rates (+2%)"
          icon="📊"
        />
      </div>

      {/* Detailed Breakdown */}
      <Card>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Income Breakdown</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-text-secondary">Adjusted Income</span>
            <span className="font-semibold text-primary text-lg">
              {formatCurrency(result.AdjustedIncome)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-text-secondary">Interest Rate (Applied)</span>
            <span className="font-semibold">{formatPercent(result.AppliedInterestRate)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-text-secondary">Stress Test Rate</span>
            <span className="font-semibold">{formatPercent(result.AppliedStressTestRate)}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-text-secondary">Loan Tenor</span>
            <span className="font-semibold">{result.LoanTenorMonths / 12} years</span>
          </div>
        </div>
      </Card>

      {/* Assumptions */}
      {result.Assumptions && (
        <Card variant="outlined">
          <h3 className="text-lg font-semibold text-primary mb-3">Assumptions</h3>
          <p className="text-sm text-text-secondary leading-relaxed">{result.Assumptions}</p>
        </Card>
      )}

      {/* Important Notice */}
      <Card variant="success">
        <div className="flex gap-3">
          <span className="text-2xl">✓</span>
          <div>
            <h4 className="font-semibold text-text-primary mb-1">Pre-Qualification Estimate</h4>
            <p className="text-sm text-text-primary">
              Your application has been pre-qualified based on the information provided. 
              To proceed with an actual loan application, please contact our loan officers.
            </p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <Button
          variant="secondary"
          size="lg"
          onClick={onCalculateAgain}
          className="flex-1"
        >
          ← Calculate Again
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={onRequestCallback}
          className="flex-1"
        >
          Request Callback →
        </Button>
      </div>
    </div>
  );
}
