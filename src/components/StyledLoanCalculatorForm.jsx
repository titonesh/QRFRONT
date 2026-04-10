import { useState } from 'react';
import Input from './Input';
import Select from './Select';
import Button from './Button';
import Card from './Card';

export default function LoanCalculatorForm({ onSubmit, loading = false }) {
  const [formData, setFormData] = useState({
    monthlySalaryIncome: '',
    monthlyBusinessIncome: '',
    monthlyRentalPayments: '',
    existingLoanObligations: '',
    preferredLoanTenorYears: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const salary = parseFloat(formData.monthlySalaryIncome) || 0;
    const business = parseFloat(formData.monthlyBusinessIncome) || 0;
    const tenure = parseInt(formData.preferredLoanTenorYears);

    if (salary + business <= 0) {
      newErrors.monthlySalaryIncome = 'At least one income source is required';
    }

    if (tenure < 1 || tenure > 25) {
      newErrors.preferredLoanTenorYears = 'Loan tenor must be between 1-25 years';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        MonthlySalaryIncome: parseFloat(formData.monthlySalaryIncome) || 0,
        MonthlyBusinessIncome: parseFloat(formData.monthlyBusinessIncome) || 0,
        MonthlyRentalPayments: parseFloat(formData.monthlyRentalPayments) || 0,
        ExistingLoanObligations: parseFloat(formData.existingLoanObligations) || 0,
        PreferredLoanTenorYears: parseInt(formData.preferredLoanTenorYears),
      });
    }
  };

  const tenorOptions = Array.from({ length: 25 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} years`,
  }));

  return (
    <Card className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Calculate Your Loan Eligibility
        </h2>
        <p className="text-text-secondary">
          Enter your income and loan details to see how much you can borrow
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Salary Income */}
        <div>
          <Input
            label="Monthly Salary Income"
            type="number"
            name="monthlySalaryIncome"
            value={formData.monthlySalaryIncome}
            onChange={handleChange}
            placeholder="Enter your monthly salary"
            error={errors.monthlySalaryIncome}
            helpText="Your regular monthly salary income"
          />
        </div>

        {/* Business Income */}
        <div>
          <Input
            label="Monthly Business Income"
            type="number"
            name="monthlyBusinessIncome"
            value={formData.monthlyBusinessIncome}
            onChange={handleChange}
            placeholder="Enter your monthly business income"
            helpText="Income from self-employment or business"
          />
        </div>

        {/* Rental Payments */}
        <div>
          <Input
            label="Monthly Rental Payments"
            type="number"
            name="monthlyRentalPayments"
            value={formData.monthlyRentalPayments}
            onChange={handleChange}
            placeholder="Enter your monthly rental income"
            helpText="Income from rental properties"
          />
        </div>

        {/* Existing Obligations */}
        <div>
          <Input
            label="Existing Loan Obligations"
            type="number"
            name="existingLoanObligations"
            value={formData.existingLoanObligations}
            onChange={handleChange}
            placeholder="Enter total monthly loan obligations"
            helpText="Total of all your monthly loan repayments"
          />
        </div>

        {/* Loan Tenor */}
        <div>
          <Select
            label="Preferred Loan Tenor"
            name="preferredLoanTenorYears"
            value={formData.preferredLoanTenorYears}
            onChange={handleChange}
            options={tenorOptions}
            error={errors.preferredLoanTenorYears}
            required
          />
        </div>

        {/* Submit Button */}
        <Button
          variant="primary"
          size="lg"
          type="submit"
          loading={loading}
          disabled={loading}
          className="w-full mt-8"
        >
          {loading ? 'Calculating...' : 'Calculate Eligibility'}
        </Button>
      </form>

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-warning-light border border-warning rounded-lg">
        <p className="text-sm text-text-primary">
          <span className="font-semibold">Disclaimer:</span> This is a pre-qualification estimate and not a formal loan offer. 
          Final approval depends on complete documentation review and credit assessment.
        </p>
      </div>
    </Card>
  );
}
