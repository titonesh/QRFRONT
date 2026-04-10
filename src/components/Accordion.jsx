import { useState } from 'react';

/**
 * Accordion Component
 * Collapsible content sections with expand/collapse animations
 */
export default function Accordion({
  items = [],
  allowMultiple = false,
  defaultOpenIndex = null,
  className = '',
}) {
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);

  const handleToggle = (index) => {
    if (allowMultiple) {
      // For multiple open items, you'd need to track an array
      setOpenIndex(openIndex === index ? null : index);
    } else {
      setOpenIndex(openIndex === index ? null : index);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item, index) => (
        <div
          key={index}
          className="border-2 border-border rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/30"
        >
          {/* Header/Trigger */}
          <button
            onClick={() => handleToggle(index)}
            className="w-full px-6 md:px-8 py-6 md:py-7 flex items-center justify-between hover:bg-neutral-light transition-colors duration-200 text-left group"
          >
            <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
              {item.question}
            </h3>
            {/* Chevron Icon */}
            <svg
              className={`w-6 h-6 text-primary transition-transform duration-300 flex-shrink-0 ml-4 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>

          {/* Content - Animated height */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openIndex === index ? 'max-h-96' : 'max-h-0'
            }`}
          >
            <div className="px-6 md:px-8 py-6 border-t-2 border-neutral-light text-gray-600 text-base leading-relaxed animate-fadeIn">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
