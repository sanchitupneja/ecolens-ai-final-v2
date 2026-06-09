import { useEffect, useRef } from 'react';

/**
 * Hook to manage focus traps in modals for screen readers and keyboard users (WCAG 2.1).
 * @param {boolean} isActive - Whether the focus trap is active.
 * @returns {React.RefObject} Ref to bind to the container element.
 */
export function useFocusTrap(isActive) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    // Select all potential keyboard focusable elements
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus the first element initially
    firstElement.focus();

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab (navigating backwards)
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        // Tab (navigating forwards)
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive]);

  return containerRef;
}

/**
 * Custom hook to enable arrow key navigation for WCAG Tab Lists.
 * @param {Array<string>} tabIds - Ordered list of tab identifiers.
 * @param {string} activeTab - The currently active tab.
 * @param {function} setActiveTab - Method to change active tab.
 * @returns {function} onKeyDown handler for the tab container.
 */
export function useTabNavigation(tabIds, activeTab, setActiveTab) {
  const handleKeyDown = (e) => {
    const currentIndex = tabIds.indexOf(activeTab);
    let nextIndex;

    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabIds.length;
      setActiveTab(tabIds[nextIndex]);
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + tabIds.length) % tabIds.length;
      setActiveTab(tabIds[nextIndex]);
      e.preventDefault();
    }
  };

  return handleKeyDown;
}
