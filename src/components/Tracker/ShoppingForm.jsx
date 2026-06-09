import React, { useState, useCallback } from 'react';
import { useCarbon } from '../../hooks/useCarbon';
import { sanitizeNumber, sanitizeString, sanitizeDate } from '../../utils/inputSanitizer';

/**
 * Accessible form to log retail and consumer shopping items footprint.
 */
export function ShoppingForm() {
  const { addActivity } = useCarbon();
  const [formData, setFormData] = useState({
    type: 'clothing',
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
      setError('Please enter a valid positive number of items.');
      return;
    }

    addActivity({
      category: 'shopping',
      type: formData.type,
      quantity: cleanQty,
      date: cleanDate,
      notes: cleanNotes
    });

    setSuccess(true);
    setFormData({
      type: 'clothing',
      quantity: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });

    setTimeout(() => setSuccess(false), 3000);
  }, [formData, addActivity]);

  return (
    <section className="glass-card" aria-labelledby="form-shopping-title">
      <h3 id="form-shopping-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1rem' }}>
        Log Shopping & Purchases
      </h3>
      
      <form noValidate onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {error && (
          <div role="alert" style={{ color: 'var(--accent-red)', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px', fontSize: '0.9rem' }}>
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div role="status" style={{ color: 'var(--brand-emerald)', padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px', fontSize: '0.9rem' }}>
            ✅ Shopping purchase logged successfully!
          </div>
        )}

        <div className="form-group">
          <label htmlFor="shopping-type" className="form-label">Product Class</label>
          <select 
            id="shopping-type" 
            className="form-select"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="clothing">Clothing / Garment (Items)</option>
            <option value="electronics">Electronics / Devices (Items)</option>
            <option value="furniture">Furniture (Items)</option>
            <option value="packaged_goods">Pre-packaged Plastic Items (Packs)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="shopping-quantity" className="form-label">Quantity (Items)</label>
          <input 
            id="shopping-quantity"
            type="number"
            className="form-input"
            step="1"
            min="0"
            required
            placeholder="e.g. 1"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            aria-describedby="shopping-quantity-help"
          />
          <span id="shopping-quantity-help" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Enter the exact count of new items bought.
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="shopping-date" className="form-label">Purchase Date</label>
          <input 
            id="shopping-date"
            type="date"
            className="form-input"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="shopping-notes" className="form-label">Notes (Optional)</label>
          <input 
            id="shopping-notes"
            type="text"
            className="form-input"
            placeholder="e.g. Purchased organic cotton jeans"
            maxLength={100}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
          Add Shopping Activity
        </button>
      </form>
    </section>
  );
}
export default ShoppingForm;
