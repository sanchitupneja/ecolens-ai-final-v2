import '@testing-library/jest-dom';

// Mock canvas and other window APIs if needed in jsdom
if (typeof window !== 'undefined') {
  // Mock HTMLCanvasElement.prototype.getContext
  HTMLCanvasElement.prototype.getContext = () => ({
    fillRect: () => {},
    clearRect: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    stroke: () => {},
    fill: () => {},
    arc: () => {},
    fillText: () => {},
    measureText: () => ({ width: 0 }),
    createLinearGradient: () => ({
      addColorStop: () => {},
    }),
  });

  // Mock scrollIntoView for React chat elements
  window.HTMLElement.prototype.scrollIntoView = function() {};
}
