import React from 'react';

/**
 * Skip to Main Content Link
 * Essential for WCAG 2.2 AA keyboard accessibility.
 */
export function SkipLink({ targetId = 'main-content', text = 'Skip to main content' }) {
  return (
    <a
      href={`#${targetId}`}
      className="skip-link"
      onClick={(e) => {
        const target = document.getElementById(targetId);
        if (target) {
          target.tabIndex = -1;
          target.focus();
        }
      }}
    >
      {text}
    </a>
  );
}

export default SkipLink;
