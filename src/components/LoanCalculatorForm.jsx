import { useState } from 'react';
import loanService from '../services/loanService';
import Input from './Input';
import Select from './Select';
import Button from './Button';
import Card from './Card';

/**
 * LoanCalculatorForm Component
 * Renders a form for customers to enter their financial information
 */
export const LoanCalculatorForm = ({ onCalculateSuccess }) => {
  const [formData, setFormData] = useState({
    monthlySalaryIncome: '',
    monthlyBusinessIncome: '',
    monthlyRentalPayments: '',
    existingLoanObligations: '',
    preferredLoanTenorYears: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /**
   * Handle input field changes
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(''); // Clear error when user starts typing
  };

  /**
   * Validate form inputs
   */
  const validateForm = () => {
    // At least one income source must be provided
    const hasIncome =
      parseFloat(formData.monthlySalaryIncome || 0) > 0 ||
      parseFloat(formData.monthlyBusinessIncome || 0) > 0 ||
      parseFloat(formData.monthlyRentalPayments || 0) > 0;

    if (!hasIncome) {
      setError('Please provide at least one source of income');
      return false;
    }

    // Loan tenor validation (allow 1-25 years)
    const tenor = parseInt(formData.preferredLoanTenorYears);
    if (tenor < 1 || tenor > 25) {
      setError('Loan tenor must be between 1 and 25 years');
      return false;
    }

    return true;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await loanService.calculateLoan(formData);
      setSuccess('Loan calculation completed successfully!');
      onCalculateSuccess(result);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Card className="card space-y-8">
        <div className="text-center md:text-left mb-2">
          <h2 className="heading-2 mb-3">Mortgage Prequalification</h2>
          <p className="body-secondary text-lg">Enter your financial information below to get started</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-error-light border-2 border-error rounded-lg animate-slideDown">
            <p className="text-sm font-semibold text-error">⚠️ Error</p>
            <p className="text-sm text-error mt-1">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-4 bg-success-light border-2 border-success rounded-lg animate-slideDown">
            <p className="text-sm font-semibold text-success">✓ Success</p>
            <p className="text-sm text-success mt-1">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Income Section */}
          <div>
            <h3 className="heading-4 mb-6 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-bold">1</span>
              Income Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Monthly Net Income"
                type="number"
                name="monthlyNetIncome"
                value={formData.monthlyNetIncome}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                helpText="60% can be used for affordability"
              />

              <Input
                label="Monthly Business Income"
                type="number"
                name="monthlyBusinessIncome"
                value={formData.monthlyBusinessIncome}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                helpText="20% after 25% discount"
              />
            </div>
          </div>

          {/* Obligations Section */}
          <div>
            <h3 className="heading-4 mb-6 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-bold">2</span>
              Existing Obligations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Current Monthly Rental Payments"
                type="number"
                name="monthlyRentalPayments"
                value={formData.monthlyRentalPayments}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                helpText="Can contribute to affordability"
              />

              <Input
                label="Existing Monthly Loan Obligations"
                type="number"
                name="existingLoanObligations"
                value={formData.existingLoanObligations}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                helpText="Car loans, credit cards, etc."
              />
            </div>
          </div>

          {/* Loan Details Section */}
          <div>
            <h3 className="heading-4 mb-6 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-bold">3</span>
              Loan Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Preferred Loan Tenor (Years)"
                type="number"
                name="preferredLoanTenorYears"
                value={formData.preferredLoanTenorYears}
                onChange={handleInputChange}
                min="1"
                max="25"
                step="1"
                helpText="Enter a number between 1 and 25 (maximum 25 years)"
              />
              <div className="flex items-end">
                <p className="text-sm text-gray-600">
                  Enter your preferred loan term (1–25 years)
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-border">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              disabled={loading}
              className="w-full md:w-auto min-w-64"
            >
              Calculate Loan Eligibility
            </Button>
            <p className="text-xs text-gray-500 mt-4">
              This calculation is preliminary and not a final loan offer. Subject to verification.
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LoanCalculatorForm;
