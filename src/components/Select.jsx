export default function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option...',
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
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full px-4 py-3 text-base rounded-lg
            border-2 transition-all duration-200
            focus:outline-none
            text-text-primary
            appearance-none cursor-pointer
            bg-white bg-no-repeat bg-right pr-10
            ${error ? 'border-error focus:border-error focus:ring-2 focus:ring-error focus:ring-opacity-30' : 'border-border focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-15'}
            ${disabled ? 'bg-surface-alt cursor-not-allowed opacity-60' : ''}
            ${className}
          `}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2300AEEF' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
            backgroundPosition: 'right 12px center',
          }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
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
