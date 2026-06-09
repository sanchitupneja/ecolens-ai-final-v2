import React, { useState, useCallback } from 'react';
import { useCarbon } from '../../hooks/useCarbon';
import { sanitizeNumber, sanitizeString, sanitizeDate } from '../../utils/inputSanitizer';

/**
 * Accessible form to log residential energy and utility usage.
 */
export function EnergyForm() {
  const { addActivity } = useCarbon();
  const [formData, setFormData] = useState({
    type: 'electricity_kwh',
    quantity: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const cleanQty = sanitizeNumber(formData.quantity);
    const cleanNotes = sanitizeString(formData.notes);
    const cleanDate = sanitizeDate(formData.date);

    if (cleanQty <= 0) {
      setError('Please enter a valid positive number for utility consumption.');
      return;
    }

    addActivity({
      category: 'energy',
      type: formData.type,
      quantity: cleanQty,
      date: cleanDate,
      notes: cleanNotes
    });

    setSuccess(true);
    setFormData({
      type: 'electricity_kwh',
      quantity: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });

    setTimeout(() => setSuccess(false), 3000);
  }, [formData, addActivity]);

  return (
    <section className="glass-card" aria-labelledby="form-energy-title">
      <h3 id="form-energy-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1rem' }}>
        Log Home Energy & Water
      </h3>
      
      <form noValidate onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {error && (
          <div role="alert" style={{ color: 'var(--accent-red)', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px', fontSize: '0.9rem' }}>
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div role="status" style={{ color: 'var(--brand-emerald)', padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px', fontSize: '0.9rem' }}>
            ✅ Energy usage logged successfully!
          </div>
        )}

        <div className="form-group">
          <label htmlFor="energy-type" className="form-label">Utility Type</label>
          <select 
            id="energy-type" 
            className="form-select"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="electricity_kwh">Electricity (kWh)</option>
            <option value="natural_gas_therms">Natural Gas (Therms)</option>
            <option value="heating_oil_gallons">Heating Oil (Gallons)</option>
            <option value="water_gallons">Water Consumption (Gallons)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="energy-quantity" className="form-label">
            Quantity ({formData.type === 'electricity_kwh' ? 'kWh' : formData.type === 'natural_gas_therms' ? 'Therms' : 'Gallons'})
          </label>
          <input 
            id="energy-quantity"
            type="number"
            className="form-input"
            step="any"
            min="0"
            required
            placeholder="e.g. 120"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            aria-describedby="energy-quantity-help"
          />
          <span id="energy-quantity-help" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Refer to your utility bill for accurate quantities.
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="energy-date" className="form-label">Billing Date</label>
          <input 
            id="energy-date"
            type="date"
            className="form-input"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="energy-notes" className="form-label">Notes (Optional)</label>
          <input 
            id="energy-notes"
            type="text"
            className="form-input"
            placeholder="e.g. June electricity bill"
            maxLength={100}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
          Add Energy Activity
        </button>
      </form>
    </section>
  );
}
export default EnergyForm;
