export default function Card({
  children,
  className = '',
  variant = 'default',
  hoverable = false,
  ...props
}) {
  const variants = {
    default: 'bg-surface border border-border shadow-md hover:shadow-lg',
    elevated: 'bg-surface shadow-lg border border-border',
    outlined: 'bg-surface-alt border-2 border-primary',
    success: 'bg-success-light border border-success rounded-xl',
    error: 'bg-error-light border border-error rounded-xl',
    warning: 'bg-warning-light border border-warning rounded-xl',
    highlight: 'bg-primary-light border border-primary shadow-md',
  };

  const hoverClass = hoverable ? 'cursor-pointer transition-all duration-200 hover:shadow-lg' : 'transition-all duration-200';

  return (
    <div
      className={`
        rounded-lg p-3 sm:p-4 md:p-6
        ${variants[variant]}
        ${hoverClass}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
