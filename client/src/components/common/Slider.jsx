import React from 'react';

/**
 * Accessible Range Slider
 * Proper semantic labeling and ARIA values for screen readers.
 */
export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  valueDisplay,
  id,
  className = '',
  disabled = false
}) {
  const sliderId = id || `slider-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`w-full py-2 ${className}`}>
      <div className="flex justify-between items-center mb-1.5">
        <label htmlFor={sliderId} className="text-base font-medium text-slate-800 dark:text-slate-200">
          {label}
        </label>
        {valueDisplay !== undefined && (
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-800 px-2.5 py-0.5 rounded-md">
            {valueDisplay}
          </span>
        )}
      </div>

      <input
        type="range"
        id={sliderId}
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 focus-visible:outline-none"
      />
    </div>
  );
}

export default Slider;
