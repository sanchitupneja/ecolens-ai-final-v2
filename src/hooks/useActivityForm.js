import { useState, useCallback } from 'react';
import { useCarbon } from './useCarbon';
import { sanitizeNumber, sanitizeString, sanitizeDate } from '../utils/inputSanitizer';

/**
 * Custom hook to abstract shared form state and validation logic for carbon footprint tracking.
 * This hook explicitly supports the **TRACK** objective of the platform by standardizing activity logging.
 *
 * @param {string} category - The activity category ('transport', 'energy', 'food', 'shopping').
 * @param {string} defaultType - The default item type for the category (e.g., 'car_petrol', 'electricity_kwh').
 * @param {string} validationErrorMessage - Custom error message for invalid numeric inputs.
 * @returns {object} Form state and event handlers.
 */
export function useActivityForm(category, defaultType, validationErrorMessage) {
  const { addActivity } = useCarbon();
  const [formData, setFormData] = useState({
    type: defaultType,
    quantity: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  /**
   * Safe setter for individual form fields.
   */
  const setFieldValue = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  /**
   * Reset form values to default state.
   */
  const resetForm = useCallback(() => {
    setFormData({
      type: defaultType,
      quantity: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
  }, [defaultType]);

  /**
   * Unified submit handler with embedded validation and sanitization.
   */
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Sanitize values
    const cleanQty = sanitizeNumber(formData.quantity);
    const cleanNotes = sanitizeString(formData.notes);
    const cleanDate = sanitizeDate(formData.date);

    if (cleanQty <= 0) {
      setError(validationErrorMessage || 'Please enter a valid positive quantity.');
      return;
    }

    // Add activity to global ledger context
    addActivity({
      category,
      type: formData.type,
      quantity: cleanQty,
      date: cleanDate,
      notes: cleanNotes
    });

    setSuccess(true);
    resetForm();

    setTimeout(() => setSuccess(false), 3000);
  }, [formData, addActivity, category, defaultType, validationErrorMessage, resetForm]);

  return {
    formData,
    setFieldValue,
    error,
    success,
    handleSubmit
  };
}

export default useActivityForm;
