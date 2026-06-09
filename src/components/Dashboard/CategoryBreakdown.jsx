import React from 'react';
import { useCarbon } from '../../hooks/useCarbon';

const CATEGORY_META = {
  transport: { label: 'Transport', color: 'var(--brand-emerald)', icon: '🚗' },
  energy: { label: 'Energy Usage', color: 'var(--accent-blue)', icon: '⚡' },
  food: { label: 'Food Habits', color: 'var(--accent-purple)', icon: '🍔' },
  shopping: { label: 'Shopping Habits', color: 'var(--accent-orange)', icon: '🛍️' }
};

/**
 * Breakdown panel showing categorical progress and detail ledger.
 */
export function CategoryBreakdown() {
  const { activities, totals, removeActivity } = useCarbon();

  return (
    <section 
      className="glass-card" 
      style={{ gridColumn: 'span 12' }}
      aria-labelledby="breakdown-section-title"
    >
      <div className="glass-card-header">
        <h3 id="breakdown-section-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem' }}>
          Emissions Breakdown & Ledger
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {activities.length} activity entries logged
        </span>
      </div>

      {/* Grid of category meters */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
          borderBottom: '1px solid var(--glass-border)',
          paddingBottom: '2rem'
        }}
      >
        {Object.entries(CATEGORY_META).map(([key, meta]) => {
          const value = totals.categoryTotals[key] || 0;
          const percentage = totals.breakdownPercentages[key] || 0;
          
          return (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>{meta.icon}</span> {meta.label}
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: meta.color }}>
                  {percentage}%
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                  {value.toFixed(1)}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>kg CO2e</span>
              </div>
              
              {/* Progress Bar */}
              <div 
                style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}
                role="progressbar"
                aria-valuenow={percentage}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label={`Percentage of total emissions for ${meta.label}`}
              >
                <div 
                  style={{ 
                    width: `${percentage}%`, 
                    height: '100%', 
                    backgroundColor: meta.color,
                    borderRadius: '3px',
                    transition: 'width var(--transition-normal) ease'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Historical Ledger List */}
      <div>
        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          Detailed Activity Log
        </h4>
        
        {activities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', border: '1px dashed var(--glass-border)', borderRadius: '8px' }}>
            No activities logged yet. Go to the Tracker tab to register carbon actions!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table 
              style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}
              aria-label="Emission logs details table"
            >
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Date</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Category</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Type</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Quantity</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Emissions (kg CO2e)</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Notes</th>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((act) => {
                  const meta = CATEGORY_META[act.category] || { label: act.category, color: 'var(--text-primary)', icon: '🌱' };
                  
                  return (
                    <tr 
                      key={act.id} 
                      style={{ 
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)', 
                        fontSize: '0.9rem',
                        transition: 'background-color var(--transition-fast)'
                      }}
                      className="ledger-row"
                    >
                      <td style={{ padding: '0.75rem 0.5rem', whiteSpace: 'nowrap' }}>{act.date}</td>
                      <td style={{ padding: '0.75rem 0.5rem', color: meta.color, fontWeight: 600 }}>
                        <span style={{ marginRight: '0.25rem' }}>{meta.icon}</span>{meta.label}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', textTransform: 'capitalize' }}>
                        {act.type.replace('_', ' ')}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        {act.quantity}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>
                        {act.emissions.toFixed(2)}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {act.notes}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                        <button
                          onClick={() => removeActivity(act.id)}
                          aria-label={`Remove activity logged on ${act.date} for ${act.type}`}
                          className="btn-delete"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--accent-red)',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
export default CategoryBreakdown;
