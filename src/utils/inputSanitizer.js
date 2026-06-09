/**
 * Utility functions to sanitize inputs and prevent XSS (Cross Site Scripting)
 * and ensure data integrity.
 */

/**
 * Strips HTML tags and script elements from a string input.
 * @param {string} input - The raw text input.
 * @returns {string} The sanitized string.
 */
export function sanitizeString(input) {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Strip script tags completely
  let sanitized = input.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '');
  
  // Strip other HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  
  // Escape common HTML characters to prevent rendering attacks
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
    
  return sanitized.trim();
}

/**
 * Validates and sanitizes numeric input fields, ensuring they are valid positive numbers.
 * @param {any} val - The numeric value to process.
 * @param {number} [defaultValue=0] - Default value if parsing fails.
 * @returns {number} Sanitized positive number.
 */
export function sanitizeNumber(val, defaultValue = 0) {
  if (val === undefined || val === null || val === '') {
    return defaultValue;
  }
  
  const parsed = parseFloat(val);
  if (isNaN(parsed) || !isFinite(parsed)) {
    return defaultValue;
  }
  
  // Carbon calculations require non-negative tracking metrics
  return Math.max(0, parsed);
}

/**
 * Validates a text code block representation if needed, ensuring no malformed inputs.
 * @param {string} dateStr - Date string value (YYYY-MM-DD)
 * @returns {string} Sanitized date ISO format.
 */
export function sanitizeDate(dateStr) {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return new Date().toISOString().split('T')[0];
  }
  return date.toISOString().split('T')[0];
}
