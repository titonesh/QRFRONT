export default function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  error = '',
  helpText = '',
  disabled = false,
  required = false,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-text-primary mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-4 py-3 text-base rounded-lg
          border-2 transition-all duration-200
          focus:outline-none
          placeholder-gray-400 text-text-primary
          ${error ? 'border-error focus:border-error focus:ring-2 focus:ring-error focus:ring-opacity-30' : 'border-border focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-15'}
          ${disabled ? 'bg-surface-alt cursor-not-allowed opacity-60' : 'bg-white'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-error mt-2 flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
      {helpText && !error && (
        <p className="text-xs text-text-secondary mt-1">{helpText}</p>
      )}
    </div>
  );
}
