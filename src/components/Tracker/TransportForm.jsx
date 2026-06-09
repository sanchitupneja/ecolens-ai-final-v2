import React, { useState, useCallback } from 'react';
import { useCarbon } from '../../hooks/useCarbon';
import { sanitizeNumber, sanitizeString, sanitizeDate } from '../../utils/inputSanitizer';

/**
 * Accessible form to log vehicular and transit travel distances.
 */
export function TransportForm() {
  const { addActivity } = useCarbon();
  const [formData, setFormData] = useState({
    type: 'car_petrol',
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

    // Sanitize input values
    const cleanQty = sanitizeNumber(formData.quantity);
    const cleanNotes = sanitizeString(formData.notes);
    const cleanDate = sanitizeDate(formData.date);

    if (cleanQty <= 0) {
      setError('Please enter a valid positive number of miles or hours.');
      return;
    }

    addActivity({
      category: 'transport',
      type: formData.type,
      quantity: cleanQty,
      date: cleanDate,
      notes: cleanNotes
    });

    setSuccess(true);
    setFormData({
      type: 'car_petrol',
      quantity: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });

    // Clear success message after delay
    setTimeout(() => setSuccess(false), 3000);
  }, [formData, addActivity]);

  return (
    <section className="glass-card" aria-labelledby="form-transport-title">
      <h3 id="form-transport-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1rem' }}>
        Log Transportation
      </h3>
      
      <form noValidate onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {error && (
          <div role="alert" style={{ color: 'var(--accent-red)', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px', fontSize: '0.9rem' }}>
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div role="status" style={{ color: 'var(--brand-emerald)', padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px', fontSize: '0.9rem' }}>
            ✅ Journey activity logged successfully!
          </div>
        )}

        <div className="form-group">
          <label htmlFor="transport-type" className="form-label">Mode of Travel</label>
          <select 
            id="transport-type" 
            className="form-select"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="car_petrol">Petrol / Diesel Car (Miles)</option>
            <option value="car_hybrid">Hybrid Vehicle (Miles)</option>
            <option value="car_electric">Electric Vehicle (Miles)</option>
            <option value="bus">Public Bus (Miles)</option>
            <option value="train">Train / Metro (Miles)</option>
            <option value="flight_short">Short-haul flight &lt; 3 hrs (Hours)</option>
            <option value="flight_long">Long-haul flight &gt; 3 hrs (Hours)</option>
            <option value="bicycle">Bicycle Ride (Miles)</option>
            <option value="walk">Walking (Miles)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="transport-quantity" className="form-label">
            Distance / Duration ({formData.type.includes('flight') ? 'Hours' : 'Miles'})
          </label>
          <input 
            id="transport-quantity"
            type="number"
            className="form-input"
            step="any"
            min="0"
            required
            placeholder={formData.type.includes('flight') ? 'e.g. 2.5' : 'e.g. 15'}
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            aria-describedby="transport-quantity-help"
          />
          <span id="transport-quantity-help" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Enter number of miles traversed, or hours in the air.
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="transport-date" className="form-label">Date of Journey</label>
          <input 
            id="transport-date"
            type="date"
            className="form-input"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="transport-notes" className="form-label">Notes (Optional)</label>
          <input 
            id="transport-notes"
            type="text"
            className="form-input"
            placeholder="e.g. Weekly commute to office"
            maxLength={100}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
          Add Transport Activity
        </button>
      </form>
    </section>
  );
}
export default TransportForm;
