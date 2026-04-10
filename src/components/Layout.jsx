export default function Layout({
  children,
  variant = 'default',
  className = '',
}) {
  const variants = {
    default: 'min-h-screen bg-neutral-50',
    centered: 'min-h-screen bg-neutral-50 flex flex-col items-center justify-center',
    fullWidth: 'min-h-screen bg-neutral-50',
  };

  return (
    <div className={`${variants[variant]} ${className}`}>
      {variant === 'centered' ? (
        <div className="w-full max-w-md px-4 py-8">
          {children}
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      )}
    </div>
  );
}
