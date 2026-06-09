import { describe, it, expect } from 'vitest';
import { sanitizeString, sanitizeNumber, sanitizeDate } from '../../utils/inputSanitizer';

describe('Input Sanitizer Utility', () => {
  it('strips HTML tags and script elements', () => {
    const dirty = '<script>alert("XSS")</script><div>Hello World</div>';
    const clean = sanitizeString(dirty);
    
    // Expect script tags completely stripped and div tags removed and escaped
    expect(clean).not.toContain('<script>');
    expect(clean).not.toContain('<div>');
    expect(clean).toContain('Hello World');
  });

  it('escapes special HTML characters', () => {
    const dirty = 'John & "Jane"';
    const clean = sanitizeString(dirty);
    expect(clean).toBe('John &amp; &quot;Jane&quot;');
  });

  it('handles non-string inputs safely', () => {
    expect(sanitizeString(null)).toBe('');
    expect(sanitizeString(undefined)).toBe('');
    expect(sanitizeString(123)).toBe('');
  });

  it('parses numbers safely and filters negatives', () => {
    expect(sanitizeNumber('123.45')).toBe(123.45);
    expect(sanitizeNumber('-50')).toBe(0); // Clamped at 0 for carbon activities
    expect(sanitizeNumber('not-a-number', 10)).toBe(10); // Fallback
  });

  it('validates dates correctly', () => {
    expect(sanitizeDate('2026-06-01')).toBe('2026-06-01');
    // Malformed date fallback to today
    const fallback = sanitizeDate('invalid-date');
    const today = new Date().toISOString().split('T')[0];
    expect(fallback).toBe(today);
  });
});
