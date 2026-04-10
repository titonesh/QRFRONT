/**
 * SuccessMessage Component
 * Displays success feedback to the user
 */
export const SuccessMessage = ({ title, message, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 bg-success-light border border-success rounded-lg shadow-lg p-6 max-w-md fade-in z-40 animate-slideDown">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-success"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1">
          {title && <h3 className="heading-5 text-success">{title}</h3>}
          <p className="body-secondary text-sm mt-1">{message}</p>
        </div>
        <button
          onClick={onDismiss}
          className="ml-3 text-success hover:text-success-dark transition-colors"
          aria-label="Dismiss"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;
