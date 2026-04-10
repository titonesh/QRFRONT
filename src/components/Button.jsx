export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  type = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

  const variants = {
    primary: 'bg-primary hover:bg-primary-dark text-white shadow-md hover:shadow-lg focus:ring-2 focus:ring-primary focus:ring-offset-2',
    secondary: 'bg-white text-primary hover:bg-primary-light border-2 border-primary shadow-md hover:shadow-lg focus:ring-2 focus:ring-primary focus:ring-offset-2',
    tertiary: 'bg-transparent text-primary hover:bg-primary-light focus:ring-2 focus:ring-primary focus:ring-offset-2',
    danger: 'bg-error hover:bg-red-600 text-white shadow-md hover:shadow-lg focus:ring-2 focus:ring-error focus:ring-offset-2',
    success: 'bg-success hover:bg-green-600 text-white shadow-md hover:shadow-lg focus:ring-2 focus:ring-success focus:ring-offset-2',
    outline: 'bg-white border-2 border-gray-300 text-gray-900 hover:bg-gray-50 focus:ring-2 focus:ring-primary hover:border-primary',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
    xl: 'px-8 py-4 text-lg font-bold',
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <div className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1"></div>
      )}
      {children}
    </button>
  );
}
