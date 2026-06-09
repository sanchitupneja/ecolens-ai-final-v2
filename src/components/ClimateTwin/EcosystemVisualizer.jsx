import React, { useMemo } from 'react';
import { useCarbon } from '../../hooks/useCarbon';

/**
 * Climate Twin Panel containing a dynamic SVG digital ecosystem visualizer
 * and projections based on current user emissions.
 */
export function EcosystemVisualizer() {
  const { totals } = useCarbon();
  const emissions = totals.grandTotal;

  // Ecosystem parameters computed from emissions
  const ecoStatus = useMemo(() => {
    if (emissions <= 200) {
      return {
        label: 'Flourishing',
        description: 'Vibrant ecosystem. Minimal emissions are easily absorbed by your digital carbon-neutral forest.',
        skyColor: 'linear-gradient(to top, #10b981, #06b6d4)', // Emerald to Teal
        smogOpacity: 0,
        treeColor: '#10b981', // Healthy green
        treeCount: 5,
        lakeColor: '#38bdf8', // Pure sky blue
        waterRating: 'Pure & Clean'
      };
    } else if (emissions <= 500) {
      return {
        label: 'Stable',
        description: 'Moderate ecosystem health. Some carbon stress is present but manageable.',
        skyColor: 'linear-gradient(to top, #059669, #0284c7)', // Green to Dark Blue
        smogOpacity: 0.15,
        treeColor: '#059669', // Olive green
        treeCount: 4,
        lakeColor: '#0284c7', // Slate blue
        waterRating: 'Clear'
      };
    } else if (emissions <= 1000) {
      return {
        label: 'Stressed',
        description: 'Noticeable signs of environmental strain. Smog layer starting to build, leaves yellowing.',
        skyColor: 'linear-gradient(to top, #d97706, #4b5563)', // Orange to Gray
        smogOpacity: 0.45,
        treeColor: '#eab308', // Yellow/Dry
        treeCount: 2,
        lakeColor: '#b45309', // Murky brown-blue
        waterRating: 'Turbid'
      };
    } else {
      return {
        label: 'Critical / Degrading',
        description: 'Severe carbon overload. Smog clouds choking the atmosphere, trees dry and scorched.',
        skyColor: 'linear-gradient(to top, #ef4444, #1f2937)', // Red to Dark Slate
        smogOpacity: 0.8,
        treeColor: '#7f1d1d', // Scorched brown
        treeCount: 1,
        lakeColor: '#451a03', // Toxic dark brown
        waterRating: 'Acidified'
      };
    }
  }, [emissions]);

  // Compute 2030 / 2050 carbon legacy projections
  const projections = useMemo(() => {
    const annualKg = emissions * 12;
    const project2030Tons = parseFloat(((annualKg * 4) / 1000).toFixed(1)); // 4 years to 2030
    const project2050Tons = parseFloat(((annualKg * 24) / 1000).toFixed(1)); // 24 years to 2050
    const treesNeeded = Math.ceil(annualKg / 22); // 1 mature tree absorbs ~22kg CO2 per year

    return {
      annualKg,
      project2030Tons,
      project2050Tons,
      treesNeeded
    };
  }, [emissions]);

  return (
    <div 
      className="dashboard-grid"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}
    >
      {/* Visual Digital Ecosystem (Climate Twin) */}
      <section 
        className="glass-card" 
        style={{ gridColumn: 'span 7', minHeight: '400px', display: 'flex', flexDirection: 'column' }}
        aria-labelledby="twin-visual-title"
      >
        <div style={{ marginBottom: '1rem' }}>
          <h3 id="twin-visual-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem' }}>
            Ecosystem Digital Twin
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Dynamic response simulation matching your carbon output (currently <strong>{emissions} kg/mo</strong>).
          </p>
        </div>

        {/* Dynamic Graphic Container */}
        <div 
          style={{
            flex: 1,
            borderRadius: '12px',
            background: ecoStatus.skyColor,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            minHeight: '260px',
            border: '1px solid var(--glass-border)',
            boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.4)'
          }}
          aria-label={`Visual Climate Twin showing state: ${ecoStatus.label}`}
        >
          {/* Smog Overlay */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '60%',
              backgroundColor: 'rgba(75, 85, 99, 0.8)',
              opacity: ecoStatus.smogOpacity,
              transition: 'opacity var(--transition-slow) ease',
              pointerEvents: 'none'
            }}
          />

          {/* Clouds */}
          {ecoStatus.smogOpacity > 0.4 && (
            <div style={{ position: 'absolute', top: '20px', left: '10%', color: 'rgba(255,255,255,0.45)', fontSize: '2rem' }}>☁️ Smog Cloud</div>
          )}

          {/* Interactive SVG Trees and Lake */}
          <svg viewBox="0 0 300 120" style={{ width: '100%', display: 'block', zIndex: 2 }}>
            {/* Ground line */}
            <path d="M0 90 Q150 85 300 90 L300 120 L0 120 Z" fill="#2d3748" />

            {/* Render Trees dynamically */}
            {Array.from({ length: ecoStatus.treeCount }).map((_, idx) => {
              const xPos = 40 + idx * 45 + (idx % 2 === 0 ? 5 : -5);
              return (
                <g key={idx} style={{ transition: 'all var(--transition-slow) ease' }}>
                  {/* Trunk */}
                  <rect x={xPos + 8} y="60" width="4" height="30" fill="#78350f" />
                  {/* Leaves */}
                  <polygon 
                    points={`${xPos + 10},35 ${xPos},65 ${xPos + 20},65`} 
                    fill={ecoStatus.treeColor} 
                    stroke="rgba(0,0,0,0.15)"
                    strokeWidth="0.5"
                  />
                  <polygon 
                    points={`${xPos + 10},45 ${xPos + 2},70 ${xPos + 18},70`} 
                    fill={ecoStatus.treeColor} 
                    stroke="rgba(0,0,0,0.15)"
                    strokeWidth="0.5"
                  />
                </g>
              );
            })}

            {/* Lake / Water Body */}
            <ellipse 
              cx="190" 
              cy="105" 
              rx="90" 
              ry="12" 
              fill={ecoStatus.lakeColor} 
              style={{ transition: 'fill var(--transition-slow) ease' }}
            />
            {ecoStatus.treeCount > 3 && (
              <text x="180" y="108" fill="#ffffff" fontSize="6" fontWeight="bold" opacity="0.6">🌊 Clean Water</text>
            )}
          </svg>

          {/* Status Floating Box */}
          <div 
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              padding: '0.4rem 0.8rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.15)',
              fontSize: '0.8rem',
              color: '#ffffff'
            }}
          >
            System Health: <strong>{ecoStatus.label}</strong>
          </div>
        </div>

        <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {ecoStatus.description} Water Condition: <em>{ecoStatus.waterRating}</em>.
        </p>
      </section>

      {/* Climate Consequences & 2030/2050 Projections */}
      <section 
        className="glass-card" 
        style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column' }}
        aria-labelledby="twin-consequences-title"
      >
        <h3 id="twin-consequences-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1rem' }}>
          Long-Term Projections
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: '8px' }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Annual CO2 Total</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Under present run-rate</p>
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
              {projections.annualKg.toLocaleString()} kg
            </span>
          </div>

          <div style={{ borderLeft: '3px solid var(--accent-orange)', paddingLeft: '1rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-orange)' }}>
              2030 Carbon Legacy (4 Years)
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Your actions will contribute to <strong>{projections.project2030Tons} metric tons</strong> of CO2. This equals emissions from driving 12,000 miles in an average car.
            </p>
          </div>

          <div style={{ borderLeft: '3px solid var(--accent-red)', paddingLeft: '1rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-red)' }}>
              2050 Carbon Legacy (24 Years)
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Cumulative footprint will reach <strong>{projections.project2050Tons} metric tons</strong>. Earth will require <strong>{projections.treesNeeded} mature trees</strong> standing for a year to absorb this impact.
            </p>
          </div>

          <div 
            style={{ 
              marginTop: 'auto', 
              padding: '0.75rem', 
              background: 'var(--brand-emerald-glow)', 
              borderRadius: '8px', 
              border: '1px solid hsla(158, 64%, 48%, 0.2)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)'
            }}
          >
            🌿 <strong>Carbon offset target:</strong> Planting {projections.treesNeeded} trees will neutralize your annual carbon legacy. Claim missions on the Challenges tab to lower emissions!
          </div>
        </div>
      </section>
    </div>
  );
}
export default EcosystemVisualizer;
