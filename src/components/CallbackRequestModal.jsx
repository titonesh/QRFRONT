import { useState } from 'react';
import loanService from '../services/loanService';
import Modal from './Modal';

function CallbackRequestModal({ onClose, loanResultId = null, loanResponse = null, loanInputs = null }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    message: '',
    referralNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
    if (name === 'phoneNumber') setPhoneError(null);
  };

  const isValidPhone = (phone) => {
    if (!phone) return false;
    const v = String(phone).trim().replace(/\s|\-|\(|\)/g, '');
    // Accept Kenyan local (0 7xxxxxxxx) or international (+2547xxxxxxxx)
    const local = /^0?7\d{8}$/; // allows 07xxxxxxxx or 7xxxxxxxx (we will prefer requiring 0 but allow both)
    const intl = /^\+?2547\d{8}$/;
    return local.test(v) || intl.test(v);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // require consents
    if (!privacyAccepted || !termsAccepted) {
      setError('You must accept the Privacy Notice and Terms & Conditions before submitting.');
      setLoading(false);
      return;
    }
    // validate phone number format
    if (!isValidPhone(formData.phoneNumber)) {
      setPhoneError('Please enter a valid Kenyan phone number (e.g. 07XXXXXXXX or +2547XXXXXXXX)');
      setLoading(false);
      return;
    }
    try {
      // Only keep the customer's freeform message in the stored message field.
      // Structured loan inputs/results are sent separately in `loanInputsJson` and `loanResultJson`.
      const combinedMessage = formData.message || '';

      await loanService.submitCallbackRequest({
        loanResultId,
        ...formData,
        message: combinedMessage,
        loanInputsJson: loanInputs ? JSON.stringify(loanInputs) : null,
        loanResultJson: loanResponse ? JSON.stringify(loanResponse) : null
      });
      setSuccess(true);
      // notify any open admin UI to refresh immediately
      try { window.dispatchEvent(new CustomEvent('callbackSubmitted', { detail: { loanResultId: loanResultId, loanResponse, loanInputs } })); } catch {}
      setTimeout(() => onClose && onClose(), 900);
    } catch (err) {
      setError(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="card-panel max-w-md w-full">
        <div className="card-title"><span>📞</span> Request a Callback</div>
        <div className="card-body">
          <div className="text-sm mb-4">A loan specialist will contact you to discuss your prequalification</div>

          {error && (
            <div style={{ padding: 12, background: '#fff2f2', border: '1px solid #f5c6c6', borderRadius: 8, marginBottom: 12 }}>
              <p style={{ color: '#992a2a', fontWeight: 700 }}>{error}</p>
            </div>
          )}

          {success ? (
            <div style={{ padding: 12, background: '#eef9f6', border: '1px solid #cfece3', borderRadius: 8 }}>
              <p style={{ color: '#0b6b4d', fontWeight: 700 }}>Thanks — we'll call you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="input-section">
                <div className="label-row">
                  <span className="field-label">Full Name</span>
                </div>
                <div className="input-wrapper">
                  <input
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Mamba Namunguba"
                    disabled={loading}
                    required
                    className="input-field"
                  />
                </div>
              </div>

              <div className="input-section">
                <div className="label-row">
                  <span className="field-label">Phone Number</span>
                </div>
                <div className="input-wrapper">
                  <input
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+254 (555) 123-4567"
                    disabled={loading}
                    required
                    className="input-field"
                  />
                </div>
              </div>

              <div className="input-section">
                <div className="label-row">
                  <span className="field-label">Email Address</span>
                </div>
                <div className="input-wrapper">
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="mamba@example.com"
                    disabled={loading}
                    required
                    className="input-field"
                  />
                </div>
              </div>

              <div className="input-section">
                <div className="label-row">
                  <span className="field-label">Message <span style={{ fontWeight: 400, color: '#6e8ea5' }}>Optional</span></span>
                </div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your preferences on how to Contact you"
                  rows="4"
                  disabled={loading}
                  className="input-field"
                  style={{ height: 100 }}
                />
              </div>

              <div className="input-section">
                <div className="label-row">
                  <span className="field-label">Referral Number <span style={{ fontWeight: 400, color: '#6e8ea5' }}>Optional</span></span>
                </div>
                <div className="input-wrapper">
                  <input
                    name="referralNumber"
                    type="text"
                    value={formData.referralNumber}
                    onChange={handleInputChange}
                    placeholder="RM-12345 (optional)"
                    disabled={loading}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="input-section mt-2">
                <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="checkbox" checked={privacyAccepted} onChange={e => setPrivacyAccepted(e.target.checked)} />
                  <span className="text-sm">I agree to the <a href="/privacy" target="_blank" rel="noreferrer" style={{ color: '#1f6e8c' }}>Privacy Notice</a></span>
                </label>
              </div>

              <div className="input-section">
                <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} />
                  <span className="text-sm">I accept the <a href="/terms" target="_blank" rel="noreferrer" style={{ color: '#1f6e8c' }}>Terms & Conditions</a></span>
                </label>
              </div>

              <div className="mt-3 flex flex-col gap-3 sm:flex-row" style={{ marginTop: 12 }}>
                <button type="button" onClick={onClose} disabled={loading} className="input-field" style={{ background: '#fff', color: '#1f6e8c', border: '1px solid #cfe6ec', width: '100%' }}>Cancel</button>
                <button type="submit" disabled={loading} className="calc-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} aria-busy={loading}>
                  {loading && (
                    <svg width="16" height="16" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff">
                      <g fill="none" fillRule="evenodd">
                        <g transform="translate(1 1)" strokeWidth="2">
                          <circle strokeOpacity="0.3" cx="18" cy="18" r="18" />
                          <path d="M36 18c0-9.94-8.06-18-18-18">
                            <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite" />
                          </path>
                        </g>
                      </g>
                    </svg>
                  )}
                  <span>{loading ? 'Submitting...' : 'Request Callback'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default CallbackRequestModal;
