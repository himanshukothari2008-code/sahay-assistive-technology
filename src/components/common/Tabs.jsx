import React, { useRef } from 'react';

/**
 * Accessible Tabs Component
 * Follows WAI-ARIA Tab specification with keyboard arrow navigation.
 */
export function Tabs({ tabs = [], activeTab, onChange, className = '' }) {
  const tabRefs = useRef([]);

  const handleKeyDown = (e, index) => {
    let newIndex = index;
    if (e.key === 'ArrowRight') {
      newIndex = (index + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      newIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      newIndex = 0;
    } else if (e.key === 'End') {
      newIndex = tabs.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    onChange(tabs[newIndex].id);
    if (tabRefs.current[newIndex]) {
      tabRefs.current[newIndex].focus();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="flex items-center gap-1 border-b-2 border-slate-200 dark:border-slate-700 overflow-x-auto pb-1"
      >
        {tabs.map((tab, idx) => {
          const isSelected = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              ref={(el) => (tabRefs.current[idx] = el)}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isSelected}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-base rounded-t-lg transition-all touch-target focus-visible:outline-none whitespace-nowrap ${
                isSelected
                  ? 'border-b-4 border-blue-600 text-blue-700 dark:text-blue-400 font-bold bg-blue-50/60 dark:bg-slate-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {Icon && <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="ml-1.5 px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Tabs;
