import React, { useState, Suspense, useTransition } from 'react';
import { CarbonProvider } from './context/CarbonContext';
import ErrorBoundary from './components/Common/ErrorBoundary';
import { useTabNavigation } from './hooks/useKeyboardNavigation';

// Lazy load feature components to optimize rendering efficiency and bundle split
const EmissionsOverview = React.lazy(() => import('./components/Dashboard/EmissionsOverview'));
const CategoryBreakdown = React.lazy(() => import('./components/Dashboard/CategoryBreakdown'));
const ProgressChart = React.lazy(() => import('./components/Dashboard/ProgressChart'));

const TransportForm = React.lazy(() => import('./components/Tracker/TransportForm'));
const EnergyForm = React.lazy(() => import('./components/Tracker/EnergyForm'));
const FoodForm = React.lazy(() => import('./components/Tracker/FoodForm'));
const ShoppingForm = React.lazy(() => import('./components/Tracker/ShoppingForm'));

const CoachChat = React.lazy(() => import('./components/AICoach/CoachChat'));
const EcosystemVisualizer = React.lazy(() => import('./components/ClimateTwin/EcosystemVisualizer'));
const SimulatedCamera = React.lazy(() => import('./components/Scanner/SimulatedCamera'));
const MissionList = React.lazy(() => import('./components/Challenges/MissionList'));

const TABS = ['dashboard', 'tracker', 'coach', 'twin', 'scanner', 'challenges'];

function MainAppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isPending, startTransition] = useTransition();

  // Custom hook for arrow-key accessibility navigation between tabs
  const onKeyDown = useTabNavigation(TABS, activeTab, (nextTab) => {
    startTransition(() => {
      setActiveTab(nextTab);
    });
  });

  const handleTabClick = (tab) => {
    startTransition(() => {
      setActiveTab(tab);
    });
  };

  return (
    <div className="app-container">
      {/* App Header */}
      <header className="app-header">
        <div className="app-logo">
          <svg width="24" height="24" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" />
            <path d="M30,50 Q45,20 70,50 Q45,80 30,50" fill="none" stroke="#FFFFFF" strokeWidth="8" />
          </svg>
          <h1>EcoPulse</h1>
        </div>

        {/* Tab Navigation List */}
        <nav 
          role="tablist" 
          aria-label="Application sections" 
          className="app-navigation"
          onKeyDown={onKeyDown}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              id={`tab-${tab}`}
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`panel-${tab}`}
              tabIndex={activeTab === tab ? 0 : -1}
              className={`nav-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </header>

      {/* Main Container */}
      <main id="main-content" className="app-main" tabIndex="-1">
        <ErrorBoundary>
          <Suspense fallback={
            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--brand-emerald)' }} role="status">
              Loading EcoPulse modules...
            </div>
          }>
            {/* Transition loader spinner indicator */}
            {isPending && (
              <div 
                style={{ 
                  position: 'fixed', 
                  top: '70px', 
                  right: '20px', 
                  padding: '0.4rem 0.8rem', 
                  background: 'var(--brand-emerald-glow)', 
                  border: '1px solid var(--brand-emerald)',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  color: 'var(--brand-emerald)',
                  zIndex: 99
                }}
                role="status"
              >
                Rendering modules...
              </div>
            )}

            {/* TAB PANELS */}
            <div 
              id="panel-dashboard" 
              role="tabpanel" 
              aria-labelledby="tab-dashboard" 
              hidden={activeTab !== 'dashboard'}
            >
              {activeTab === 'dashboard' && (
                <>
                  <div className="page-title-section">
                    <h2 className="page-title">Sustainability Dashboard</h2>
                    <p className="page-subtitle">Track aggregated carbon footprint stats and long-term emission trends.</p>
                  </div>
                  
                  {/* Problem Statement Alignment Helper Banner */}
                  <div className="sustainability-alignment-banner">
                    <div>
                      <h4>How this helps:</h4>
                      <p>
                        <strong>Understand:</strong> Displays your total footprint against a sustainable 400kg monthly budget.<br />
                        <strong>Track:</strong> Groups ledger items by transport, energy, food, and shopping.<br />
                        <strong>Reduce:</strong> Identify high carbon spikes in the charts to optimize your lifestyle.
                      </p>
                    </div>
                  </div>

                  <EmissionsOverview />
                  <div className="dashboard-grid">
                    <ProgressChart />
                    <CategoryBreakdown />
                  </div>
                </>
              )}
            </div>

            <div 
              id="panel-tracker" 
              role="tabpanel" 
              aria-labelledby="tab-tracker" 
              hidden={activeTab !== 'tracker'}
            >
              {activeTab === 'tracker' && (
                <>
                  <div className="page-title-section">
                    <h2 className="page-title">Emissions Tracker</h2>
                    <p className="page-subtitle">Log activities to calculate and index your exact carbon emissions output.</p>
                  </div>

                  {/* Alignment Banner */}
                  <div className="sustainability-alignment-banner">
                    <div>
                      <h4>How this helps:</h4>
                      <p>
                        <strong>Understand:</strong> Maps precise metrics (miles, kWh, servings) to CO2 weight.<br />
                        <strong>Track:</strong> Keep a continuous digital footprint log for analysis.<br />
                        <strong>Reduce:</strong> Build baseline awareness, motivating lower travel and dietary emissions.
                      </p>
                    </div>
                  </div>

                  <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    <TransportForm />
                    <EnergyForm />
                    <FoodForm />
                    <ShoppingForm />
                  </div>
                </>
              )}
            </div>

            <div 
              id="panel-coach" 
              role="tabpanel" 
              aria-labelledby="tab-coach" 
              hidden={activeTab !== 'coach'}
            >
              {activeTab === 'coach' && (
                <>
                  <div className="page-title-section">
                    <h2 className="page-title">Personal AI Coach</h2>
                    <p className="page-subtitle">AI-powered habit analysis and tailored recommendations.</p>
                  </div>

                  {/* Alignment Banner */}
                  <div className="sustainability-alignment-banner">
                    <div>
                      <h4>How this helps:</h4>
                      <p>
                        <strong>Understand:</strong> Explains how energy consumption and fast fashion build footprints.<br />
                        <strong>Track:</strong> Scans logged footprint entries for customized advice.<br />
                        <strong>Reduce:</strong> Proposes action plans to switch to LEDs, public transit, and meatless diets.
                      </p>
                    </div>
                  </div>

                  <CoachChat />
                </>
              )}
            </div>

            <div 
              id="panel-twin" 
              role="tabpanel" 
              aria-labelledby="tab-twin" 
              hidden={activeTab !== 'twin'}
            >
              {activeTab === 'twin' && (
                <>
                  <div className="page-title-section">
                    <h2 className="page-title">Ecosystem Climate Twin</h2>
                    <p className="page-subtitle">A digital landscape reflecting the immediate health of our planet matching your footprint.</p>
                  </div>

                  {/* Alignment Banner */}
                  <div className="sustainability-alignment-banner">
                    <div>
                      <h4>How this helps:</h4>
                      <p>
                        <strong>Understand:</strong> Provides real-time visual feedback on tree, air, and water health.<br />
                        <strong>Track:</strong> Updates instantly on your monthly footprint progress.<br />
                        <strong>Reduce:</strong> Demonstrates long-term 2030 and 2050 climate consequences of current habits.
                      </p>
                    </div>
                  </div>

                  <EcosystemVisualizer />
                </>
              )}
            </div>

            <div 
              id="panel-scanner" 
              role="tabpanel" 
              aria-labelledby="tab-scanner" 
              hidden={activeTab !== 'scanner'}
            >
              {activeTab === 'scanner' && (
                <>
                  <div className="page-title-section">
                    <h2 className="page-title">Sustainability Vision Scanner</h2>
                    <p className="page-subtitle">Scan products, receipts, and waste to check their lifecycle carbon score.</p>
                  </div>

                  {/* Alignment Banner */}
                  <div className="sustainability-alignment-banner">
                    <div>
                      <h4>How this helps:</h4>
                      <p>
                        <strong>Understand:</strong> Displays lifecycle emissions (A to F) before purchase.<br />
                        <strong>Track:</strong> Logs scanned objects directly to your ledger context.<br />
                        <strong>Reduce:</strong> Suggests sustainable low-carbon alternative replacements.
                      </p>
                    </div>
                  </div>

                  <SimulatedCamera />
                </>
              )}
            </div>

            <div 
              id="panel-challenges" 
              role="tabpanel" 
              aria-labelledby="tab-challenges" 
              hidden={activeTab !== 'challenges'}
            >
              {activeTab === 'challenges' && (
                <>
                  <div className="page-title-section">
                    <h2 className="page-title">Community Challenges</h2>
                    <p className="page-subtitle">Join missions, check the leaderboard, and unlock sustainability achievements.</p>
                  </div>

                  {/* Alignment Banner */}
                  <div className="sustainability-alignment-banner">
                    <div>
                      <h4>How this helps:</h4>
                      <p>
                        <strong>Understand:</strong> Shows peer standings, proving that collective small steps make a difference.<br />
                        <strong>Track:</strong> Renders active challenge objectives and score thresholds.<br />
                        <strong>Reduce:</strong> Encourages turning off chargers and commuting car-free to earn badges.
                      </p>
                    </div>
                  </div>

                  <MissionList />
                </>
              )}
            </div>

          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>© 2026 EcoPulse Carbon Awareness Platform. Built for the PromptWars Challenge.</p>
        <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
          Optimized for accessibility, performance, and security.
        </p>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <CarbonProvider>
      <MainAppContent />
    </CarbonProvider>
  );
}
export default App;
