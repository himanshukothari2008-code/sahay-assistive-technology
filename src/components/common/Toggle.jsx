import React from 'react';

/**
 * Accessible Toggle Switch
 * Follows WAI-ARIA Switch specification.
 */
export function Toggle({
  checked = false,
  onChange,
  label,
  description,
  id,
  disabled = false,
  className = ''
}) {
  const switchId = id || `switch-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`flex items-center justify-between gap-4 py-2 ${className}`}>
      <div className="flex flex-col">
        <label
          htmlFor={switchId}
          className="text-base font-medium text-slate-900 dark:text-slate-100 cursor-pointer"
        >
          {label}
        </label>
        {description && (
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {description}
          </span>
        )}
      </div>

      <button
        type="button"
        role="switch"
        id={switchId}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none touch-target ${
          checked ? 'bg-blue-600 dark:bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className="sr-only">{label}</span>
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

export default Toggle;
