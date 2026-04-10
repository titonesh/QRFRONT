export default function Modal({
  onClose,
  title,
  children,
  className = '',
  size = 'md',
}) {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={`
            bg-white rounded-xl shadow-2xl
            w-full ${sizes[size]}
            max-h-[90vh] overflow-y-auto
            animate-slideUp
            ${className}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                aria-label="Close modal"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
          )}

          {/* Body */}
          <div className={title ? 'p-6' : 'p-8'}>{children}</div>
        </div>
      </div>
    </div>
  );
}
