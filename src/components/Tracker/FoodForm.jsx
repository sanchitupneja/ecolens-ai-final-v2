import React from 'react';
import { useActivityForm } from '../../hooks/useActivityForm';

/**
 * Accessible form to log dietary and food items carbon output.
 * This component explicitly contributes to the **TRACK** objective.
 */
export function FoodForm() {
  const {
    formData,
    setFieldValue,
    error,
    success,
    handleSubmit
  } = useActivityForm('food', 'beef', 'Please enter a valid positive serving number.');

  return (
    <section className="glass-card" aria-labelledby="form-food-title">
      <h3 id="form-food-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1rem' }}>
        Log Food Consumption
      </h3>
      
      <form noValidate onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {error && (
          <div role="alert" style={{ color: 'var(--accent-red)', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px', fontSize: '0.9rem' }}>
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div role="status" style={{ color: 'var(--brand-emerald)', padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px', fontSize: '0.9rem' }}>
            ✅ Food emissions logged successfully!
          </div>
        )}

        <div className="form-group">
          <label htmlFor="food-type" className="form-label">Dietary Item</label>
          <select 
            id="food-type" 
            className="form-select"
            value={formData.type}
            onChange={(e) => setFieldValue('type', e.target.value)}
          >
            <option value="beef">Beef (Servings)</option>
            <option value="poultry_pork">Poultry / Pork (Servings)</option>
            <option value="dairy">Dairy Products (Servings)</option>
            <option value="plant_based">Plant-Based Grains/Pulses (Servings)</option>
            <option value="veg_local">Locally Sourced Fruits/Veg (Servings)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="food-quantity" className="form-label">Number of Servings</label>
          <input 
            id="food-quantity"
            type="number"
            className="form-input"
            step="any"
            min="0"
            required
            placeholder="e.g. 3"
            value={formData.quantity}
            onChange={(e) => setFieldValue('quantity', e.target.value)}
            aria-describedby="food-quantity-help"
          />
          <span id="food-quantity-help" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Enter how many individual servings or meals you consumed.
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="food-date" className="form-label">Date</label>
          <input 
            id="food-date"
            type="date"
            className="form-input"
            required
            value={formData.date}
            onChange={(e) => setFieldValue('date', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="food-notes" className="form-label">Notes (Optional)</label>
          <input 
            id="food-notes"
            type="text"
            className="form-input"
            placeholder="e.g. Sunday steak dinner"
            maxLength={100}
            value={formData.notes}
            onChange={(e) => setFieldValue('notes', e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
          Add Food Activity
        </button>
      </form>
    </section>
  );
}
export default FoodForm;
