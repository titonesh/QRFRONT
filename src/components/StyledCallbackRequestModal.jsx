import { useState } from 'react';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';

export default function StyledCallbackRequestModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  loanResultId,
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        LoanResultId: loanResultId,
      });
      // Reset form
      setFormData({
        fullName: '',
        phoneNumber: '',
        email: '',
        message: '',
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request a Callback">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter your full name"
          error={errors.fullName}
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="e.g., +254 7XX XXX XXX"
          error={errors.phoneNumber}
          required
        />

        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your.email@example.com"
          error={errors.email}
          required
        />

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            Message (Optional)
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us any specific questions or requirements..."
            className={`
              w-full px-4 py-3 text-base rounded-lg
              border-2 border-border
              focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-10
              focus:outline-none transition-all duration-200
              placeholder-text-secondary text-text-primary
              resize-none h-24
            `}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            type="submit"
            loading={loading}
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </Button>
        </div>
      </form>

      <p className="text-xs text-text-secondary text-center mt-4">
        Our loan officers will contact you within 24 business hours
      </p>
    </Modal>
  );
}
