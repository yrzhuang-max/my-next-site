'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
      {items.map((item, idx) => (
        <div key={idx}>
          <button
            onClick={() => toggle(idx)}
            className="w-full text-left p-4 md:p-6 flex justify-between items-center gap-4 hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-800">{item.question}</span>
            <span className={`text-gray-500 transition-transform duration-200 ${openIndex === idx ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-200 ${
              openIndex === idx ? 'max-h-[500px]' : 'max-h-0'
            }`}
          >
            <div className="px-4 pb-4 md:px-6 md:pb-6 text-gray-600">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}