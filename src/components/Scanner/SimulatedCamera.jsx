import React, { useState, useCallback } from 'react';
import { useCarbon } from '../../hooks/useCarbon';
import { getProductScanResult } from '../../utils/mockAIResponse';

/**
 * Sustainability Vision Scanner panel simulating receipt/waste scans.
 */
export function SimulatedCamera() {
  const { addActivity, addScannedItem } = useCarbon();
  const [selectedKey, setSelectedKey] = useState('plastic_bottle');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const handleScan = useCallback(() => {
    setIsScanning(true);
    setScanResult(null);

    // Simulate scanning processing time
    setTimeout(() => {
      const result = getProductScanResult(selectedKey);
      setScanResult(result);
      setIsScanning(false);
      
      // Save item to scanner history state
      addScannedItem({
        name: result.name,
        carbonScore: result.carbonScore,
        sustainabilityScore: result.sustainabilityScore,
        emissionsKg: result.emissionsKg
      });
    }, 1200);
  }, [selectedKey, addScannedItem]);

  const handleLogActivity = useCallback((alternativeChosen) => {
    if (!scanResult) return;
    
    // If user opts for the eco alternative, they log the green activity
    if (alternativeChosen) {
      addActivity({
        category: 'shopping',
        type: 'packaged_goods', // or general category
        quantity: 1,
        date: new Date().toISOString().split('T')[0],
        notes: `Green Alternative: Chosen instead of ${scanResult.name}`
      });
      alert('Congratulations! You logged the green alternative. Keep up the high score!');
    } else {
      // Log the standard carbon impact
      addActivity({
        category: scanResult.category.toLowerCase(),
        type: scanResult.category === 'Food' ? 'beef' : 'packaged_goods', // map roughly
        quantity: 1,
        date: new Date().toISOString().split('T')[0],
        notes: `Logged original: ${scanResult.name}`
      });
      alert('Activity logged. Check your dashboard to monitor total emissions.');
    }
    setScanResult(null);
  }, [scanResult, addActivity]);

  return (
    <div 
      className="dashboard-grid"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}
    >
      {/* Scanner Viewfinder Box */}
      <section 
        className="glass-card" 
        style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '1rem' }}
        aria-labelledby="scanner-view-title"
      >
        <h3 id="scanner-view-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem' }}>
          Simulated AI Vision Scanner
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Select a product type to scan. Point your simulated lens to assess materials, lifecycle carbon, and sustainability scores.
        </p>

        {/* Viewfinder Graphics */}
        <div 
          style={{
            position: 'relative',
            height: '220px',
            backgroundColor: '#0a0e17',
            borderRadius: '12px',
            border: '2px dashed var(--brand-emerald)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Scanning Line overlay */}
          {isScanning && (
            <div 
              style={{
                position: 'absolute',
                left: 0,
                width: '100%',
                height: '4px',
                backgroundColor: 'var(--brand-emerald)',
                boxShadow: '0 0 15px var(--brand-emerald)',
                zIndex: 3,
                animation: 'scan-animation 1.5s infinite linear'
              }}
            />
          )}

          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {isScanning ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span>📷 Activating Lens Matrix...</span>
                <span style={{ fontSize: '0.75rem' }}>Running neural classification models</span>
              </div>
            ) : (
              <div>
                <span style={{ fontSize: '2rem' }}>🔍</span>
                <p style={{ marginTop: '0.5rem' }}>Ready to Scan</p>
              </div>
            )}
          </div>
        </div>

        {/* Select template target */}
        <div className="form-group">
          <label htmlFor="scanner-item-selector" className="form-label">Select Scanning Target</label>
          <select 
            id="scanner-item-selector" 
            className="form-select"
            value={selectedKey}
            onChange={(e) => setSelectedKey(e.target.value)}
            disabled={isScanning}
          >
            <option value="plastic_bottle">Plastic Water Bottle (Waste)</option>
            <option value="beef_patty">Beef Patty (Food Receipt)</option>
            <option value="disposable_cup">Paper Coffee Cup (Waste/Product)</option>
            <option value="cheap_tshirt">Fast-Fashion Shirt (Product Tag)</option>
            <option value="new_smartphone">New Generation Smartphone (Box/Receipt)</option>
          </select>
        </div>

        <button 
          onClick={handleScan}
          disabled={isScanning}
          className="btn btn-primary"
          style={{ width: '100%', padding: '0.75rem' }}
        >
          {isScanning ? 'Scanning...' : 'Scan Product / Receipt'}
        </button>
      </section>

      {/* Scanner Results Panel */}
      <section 
        className="glass-card" 
        style={{ gridColumn: 'span 6', minHeight: '380px', display: 'flex', flexDirection: 'column' }}
        aria-labelledby="scanner-results-title"
      >
        <h3 id="scanner-results-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1rem' }}>
          Scan Assessment Report
        </h3>

        {scanResult ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            {/* Top overview */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {scanResult.name}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Class: {scanResult.category}</p>
              </div>
              <div 
                style={{
                  backgroundColor: scanResult.carbonScore > 40 ? 'var(--brand-emerald-glow)' : 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid',
                  borderColor: scanResult.carbonScore > 40 ? 'var(--brand-emerald)' : 'var(--accent-red)',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  textAlign: 'center',
                  minWidth: '55px'
                }}
              >
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Eco Grade</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{scanResult.sustainabilityScore}</div>
              </div>
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: '8px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Carbon Score</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-emerald)' }}>
                  {scanResult.carbonScore}/100
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Est. Footprint</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-orange)' }}>
                  {scanResult.emissionsKg} kg CO2e
                </div>
              </div>
            </div>

            {/* Lifecycle analysis */}
            <div>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Impact Analysis</h5>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
                {scanResult.analysis}
              </p>
            </div>

            {/* Alternatives suggestion list */}
            <div>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-emerald)', marginBottom: '0.5rem' }}>
                🌱 Low-Carbon Alternatives
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {scanResult.alternatives.map((alt, idx) => (
                  <div key={idx} style={{ border: '1px solid var(--glass-border)', padding: '0.5rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                      <span>{alt.name}</span>
                      <span style={{ color: 'var(--brand-emerald)' }}>{alt.reduction}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{alt.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
              <button 
                onClick={() => handleLogActivity(true)}
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                Log Green Alternative
              </button>
              <button 
                onClick={() => handleLogActivity(false)}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                Log Original
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, border: '1px dashed var(--glass-border)', borderRadius: '8px', padding: '2rem' }}>
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.85rem' }}>
              Scan an item using the viewfinder panel on the left to see the environmental impact analysis and alternatives suggestions.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
export default SimulatedCamera;
