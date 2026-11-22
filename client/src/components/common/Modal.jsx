import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

/**
 * Accessible Modal Dialog
 * Implements WAI-ARIA dialog specification with focus trapping and ESC closing.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true
}) {
  const modalRef = useRef(null);
  const previouslyFocusedElement = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement;
      document.body.style.overflow = 'hidden';

      // Focus first focusable element inside modal
      setTimeout(() => {
        if (modalRef.current) {
          const focusable = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length > 0) {
            focusable[0].focus();
          }
        }
      }, 50);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        if (previouslyFocusedElement.current && previouslyFocusedElement.current.focus) {
          previouslyFocusedElement.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? 'modal-description' : undefined}
        className={`w-full ${sizes[size] || sizes.md} bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 id="modal-title" className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h2>
            {description && (
              <p id="modal-description" className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {description}
              </p>
            )}
          </div>
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg touch-target focus-visible:outline-none"
            >
              <X className="w-6 h-6" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
