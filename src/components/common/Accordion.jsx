import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Accessible Accordion Component
 * Implements WAI-ARIA disclosure pattern with keyboard enter/space toggling.
 */
export function Accordion({ items = [], allowMultiple = false, className = '' }) {
  const [openIndices, setOpenIndices] = useState([0]);

  const toggleItem = (index) => {
    if (allowMultiple) {
      setOpenIndices((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndices((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <div className={`space-y-3 w-full ${className}`}>
      {items.map((item, idx) => {
        const isOpen = openIndices.includes(idx);
        const headerId = `acc-header-${idx}`;
        const panelId = `acc-panel-${idx}`;

        return (
          <div
            key={idx}
            className="border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 transition-colors"
          >
            <h3>
              <button
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(idx)}
                className="w-full flex items-center justify-between p-4 text-left font-semibold text-lg text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-750 focus-visible:outline-none touch-target"
              >
                <span className="flex items-center gap-3">
                  {item.icon && <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />}
                  {item.title}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-slate-500 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              hidden={!isOpen}
              className={`p-4 pt-0 text-slate-700 dark:text-slate-300 border-t border-slate-100 dark:border-slate-700/50 ${
                isOpen ? 'block' : 'hidden'
              }`}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;
