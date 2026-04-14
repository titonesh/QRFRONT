import apiClient from './apiClient';

/**
 * Loan API Service
 * Handles all loan-related API calls
 */

export const loanService = {
  /**
   * Calculate loan eligibility
   * @param {Object} loanData - Customer financial data
   * @returns {Promise} API response with loan calculation results
   */
  calculateLoan: async (loanData) => {
    try {
      // Sanitize numeric inputs: ensure non-negative numbers and sensible tenor
      const ms = Number.parseFloat(loanData.monthlySalaryIncome);
      const mb = Number.parseFloat(loanData.monthlyBusinessIncome);
      const mr = Number.parseFloat(loanData.monthlyRentalPayments);
      const eo = Number.parseFloat(loanData.existingLoanObligations);
      const tenorRaw = parseInt(loanData.preferredLoanTenorYears, 10);

      const payload = {
        productType: loanData.productType || null,
        monthlySalaryIncome: isNaN(ms) ? 0 : Math.max(0, ms),
        monthlyBusinessIncome: isNaN(mb) ? 0 : Math.max(0, mb),
        monthlyRentalPayments: isNaN(mr) ? 0 : Math.max(0, mr),
        existingLoanObligations: isNaN(eo) ? 0 : Math.max(0, eo),
        // Card/OD utilisation captured in `existingLoanObligations` on UI; send zero here
        creditCardLimit: 0,
        overdraftLimit: 0,
        // Default tenor to 1 year when missing or invalid
        preferredLoanTenorYears: isNaN(tenorRaw) ? 1 : Math.max(1, tenorRaw),
      };

      const response = await apiClient.post('/loan/calculate', payload);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to calculate loan. Please try again.'
      );
    }
  },

  /**
   * Submit callback request
   * @param {Object} callbackData - Customer contact information
   * @returns {Promise} API response confirming callback request
   */
  submitCallbackRequest: async (callbackData) => {
    try {
      // Ensure loanResultId is a valid integer; backend expects an integer (non-nullable)
      const parsedLoanResultId = parseInt(callbackData.loanResultId, 10);
      const payload = {
        loanResultId: isNaN(parsedLoanResultId) ? 0 : parsedLoanResultId,
        fullName: callbackData.fullName?.trim(),
        phoneNumber: callbackData.phoneNumber?.trim(),
        email: callbackData.email?.trim(),
        referralNumber: callbackData.referralNumber?.trim() || null,
        message: callbackData.message?.trim() || null,
        loanInputsJson: callbackData.loanInputsJson || null,
        loanResultJson: callbackData.loanResultJson || null,
      };

      try { console.debug('[loanService] submitCallbackRequest payload:', payload); } catch {}

      const response = await apiClient.post('/loan/callback-request', payload);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to submit callback request. Please try again.'
      );
    }
  },

  /**
   * Health check endpoint
   * @returns {Promise} API health status
   */
  healthCheck: async () => {
    try {
      const response = await apiClient.get('/loan/health');
      return response.data;
    } catch (error) {
      throw new Error('API health check failed');
    }
  },
};

export default loanService;
