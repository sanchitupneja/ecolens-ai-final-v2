import React, { useMemo } from 'react';
import { useCarbon } from '../../hooks/useCarbon';
import { getEmissionsRating } from '../../utils/emissionsCalculator';

/**
 * Overview component rendering card highlights for monthly footprint,
 * carbon limit, and rank achievements.
 */
export function EmissionsOverview() {
  const { totals, points, badges } = useCarbon();
  
  const rating = useMemo(() => {
    return getEmissionsRating(totals.grandTotal);
  }, [totals.grandTotal]);

  return (
    <div 
      className="overview-container"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
        width: '100%'
      }}
    >
      {/* Monthly Emission Card */}
      <section 
        className="glass-card" 
        style={{ position: 'relative', overflow: 'hidden' }}
        aria-labelledby="card-emissions-title"
      >
        <h3 id="card-emissions-title" className="sr-only">Monthly Carbon Emissions Summary</h3>
        <p className="form-label" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
          Monthly Footprint
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.5rem 0' }}>
          <span 
            style={{ 
              fontSize: '3rem', 
              fontWeight: 800, 
              fontFamily: 'var(--font-heading)',
              color: rating.color
            }}
          >
            {totals.grandTotal}
          </span>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>kg CO2e</span>
        </div>
        
        {/* Progress Bar relative to target */}
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
            <span>Monthly Budget Usage</span>
            <span>{totals.budgetUsagePercentage}%</span>
          </div>
          <div 
            style={{ 
              width: '100%', 
              height: '8px', 
              backgroundColor: 'var(--bg-tertiary)', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}
            role="progressbar"
            aria-valuenow={totals.budgetUsagePercentage}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label="Carbon budget utilization meter"
          >
            <div 
              style={{ 
                width: `${totals.budgetUsagePercentage}%`, 
                height: '100%', 
                backgroundColor: totals.isOverBudget ? 'var(--accent-red)' : 'var(--brand-emerald)',
                borderRadius: '4px',
                transition: 'width var(--transition-slow) ease'
              }}
            />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Target Limit: <strong>{totals.targetBudget} kg CO2e</strong>
          </p>
        </div>
      </section>

      {/* Climate Badge Card */}
      <section 
        className="glass-card"
        aria-labelledby="card-rating-title"
      >
        <h3 id="card-rating-title" className="sr-only">Climate Rating</h3>
        <p className="form-label" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
          Ecosystem Rating
        </p>
        <h4 
          style={{ 
            fontFamily: 'var(--font-heading)', 
            fontSize: '1.75rem', 
            fontWeight: 700, 
            color: rating.color,
            margin: '0.5rem 0'
          }}
        >
          {rating.label}
        </h4>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', minHeight: '60px' }}>
          {rating.description}
        </p>
      </section>

      {/* Community score points */}
      <section 
        className="glass-card"
        aria-labelledby="card-rewards-title"
      >
        <h3 id="card-rewards-title" className="sr-only">Rewards and Milestones</h3>
        <p className="form-label" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
          Reward Points & Badges
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
          <div 
            style={{ 
              backgroundColor: 'hsla(24, 94%, 50%, 0.15)', 
              color: 'var(--accent-orange)', 
              borderRadius: '50%', 
              width: '60px', 
              height: '60px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '1.25rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              border: '1px solid hsla(24, 94%, 50%, 0.3)',
              boxShadow: '0 0 15px hsla(24, 94%, 50%, 0.1)'
            }}
          >
            {points}
          </div>
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 600 }}>
              Eco Balance
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Claim challenges to earn tokens
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
          {badges.map((badge, idx) => (
            <span 
              key={idx}
              style={{
                fontSize: '0.7rem',
                padding: '0.25rem 0.6rem',
                borderRadius: '12px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-primary)',
                fontWeight: 600
              }}
            >
              🏅 {badge}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
export default EmissionsOverview;
