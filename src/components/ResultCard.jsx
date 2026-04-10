import Card from './Card';

export default function ResultCard({ title, value, subtitle, highlight = false, icon }) {
  return (
    <Card variant={highlight ? 'highlight' : 'default'} className={`text-center ${highlight ? 'border-2' : ''}`}>
      {icon && (
        <div className={`text-4xl mb-3 ${highlight ? 'text-primary' : 'text-primary'}`}>
          {icon}
        </div>
      )}
      <p className="text-text-secondary text-sm font-semibold mb-2 uppercase tracking-wider">{title}</p>
      <p
        className={`font-bold transition-all duration-200 ${
          highlight
            ? 'text-4xl text-primary'
            : 'text-2xl text-text-primary'
        }`}
      >
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-text-secondary mt-3 font-medium">{subtitle}</p>
      )}
    </Card>
  );
}
