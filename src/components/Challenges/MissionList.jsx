import React, { useMemo } from 'react';
import { useCarbon } from '../../hooks/useCarbon';

// Local leaderboard static list
const MOCK_LEADERBOARD = [
  { name: 'David Attenborough', score: 980, isUser: false },
  { name: 'Greta Thunberg', score: 850, isUser: false },
  { name: 'Jane Goodall', score: 720, isUser: false },
  { name: 'Eco Explorer (You)', score: 150, isUser: true }, // will replace score dynamically
  { name: 'John Doe', score: 95, isUser: false }
];

/**
 * Challenges component rendering active missions list, local leaderboard rankings,
 * and unlocked achievements / badges room.
 */
export function MissionList() {
  const { challenges, claimChallenge, points, badges } = useCarbon();

  // Dynamically compute leaderboard placing user points
  const leaderboard = useMemo(() => {
    const list = MOCK_LEADERBOARD.map(p => {
      if (p.isUser) {
        return { ...p, score: points };
      }
      return p;
    });
    // Sort descending
    return list.sort((a, b) => b.score - a.score);
  }, [points]);

  return (
    <div 
      className="dashboard-grid"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}
    >
      {/* Active Missions */}
      <section 
        className="glass-card" 
        style={{ gridColumn: 'span 7' }}
        aria-labelledby="missions-title"
      >
        <div className="glass-card-header">
          <h3 id="missions-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem' }}>
            Daily Climate Missions
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Complete real actions to earn Green Tokens
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {challenges.map((chal) => {
            const isCompleted = chal.status === 'completed';
            return (
              <div 
                key={chal.id}
                style={{
                  border: '1px solid var(--glass-border)',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: isCompleted ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-tertiary)',
                  borderColor: isCompleted ? 'hsla(158, 64%, 48%, 0.3)' : 'var(--glass-border)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div style={{ flex: 1, paddingRight: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem', color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                      {chal.name}
                    </span>
                    <span 
                      style={{ 
                        fontSize: '0.75rem', 
                        padding: '0.1rem 0.4rem', 
                        borderRadius: '4px',
                        backgroundColor: 'hsla(24, 94%, 50%, 0.15)',
                        color: 'var(--accent-orange)',
                        fontWeight: 600
                      }}
                    >
                      +{chal.points} pts
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    {chal.description}
                  </p>
                </div>
                
                <button 
                  onClick={() => claimChallenge(chal.id)}
                  disabled={isCompleted}
                  className={`btn ${isCompleted ? 'btn-secondary' : 'btn-primary'}`}
                  style={{
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.8rem',
                    minWidth: '100px'
                  }}
                  aria-label={isCompleted ? `Mission ${chal.name} already claimed` : `Claim reward for completing ${chal.name}`}
                >
                  {isCompleted ? 'Claimed ✓' : 'Claim Reward'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Leaderboard & Badges */}
      <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Score Leaderboard */}
        <section 
          className="glass-card"
          aria-labelledby="leaderboard-title"
        >
          <h3 id="leaderboard-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', marginBottom: '1rem' }}>
            Regional Scoreboard
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {leaderboard.map((user, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  backgroundColor: user.isUser ? 'var(--brand-emerald-glow)' : 'transparent',
                  border: user.isUser ? '1px solid hsla(158, 64%, 48%, 0.3)' : 'none'
                }}
              >
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: idx === 0 ? 'var(--accent-orange)' : 'var(--text-muted)', width: '20px' }}>
                    #{idx + 1}
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: user.isUser ? 700 : 500 }}>
                    {user.name}
                  </span>
                </div>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--brand-emerald)' }}>
                  {user.score} pts
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Badge Room */}
        <section 
          className="glass-card"
          aria-labelledby="badge-title"
        >
          <h3 id="badge-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', marginBottom: '1rem' }}>
            Achievements Room
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Unlock these by tracking activities, scanning products, and completing challenges.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.75rem' }}>
            {[
              { title: 'Eco First Step', desc: 'Welcome badge', emoji: '🌱' },
              { title: 'Active Tracker', desc: 'Log your first action', emoji: '✏️' },
              { title: 'Challenger Initiate', desc: 'Complete 1 mission', emoji: '⚔️' },
              { title: 'Sustainer Master', desc: 'Complete 3 missions', emoji: '👑' },
              { title: 'Visionary Scanner', desc: 'Scan first product', emoji: '📷' },
              { title: 'Carbon Aware', desc: 'Log major footprint activity', emoji: '💡' }
            ].map((meta, idx) => {
              const isUnlocked = badges.includes(meta.title);
              return (
                <div 
                  key={idx}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid',
                    borderColor: isUnlocked ? 'var(--glass-border)' : 'rgba(255,255,255,0.03)',
                    borderRadius: '8px',
                    textAlign: 'center',
                    background: isUnlocked ? 'var(--bg-tertiary)' : 'rgba(0,0,0,0.2)',
                    opacity: isUnlocked ? 1 : 0.35,
                    position: 'relative'
                  }}
                  title={meta.desc}
                >
                  <div style={{ fontSize: '1.5rem' }}>{meta.emoji}</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, marginTop: '0.25rem', color: 'var(--text-primary)' }}>
                    {meta.title}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
export default MissionList;
