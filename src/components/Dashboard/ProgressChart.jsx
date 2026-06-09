import React, { useMemo } from 'react';
import { useCarbon } from '../../hooks/useCarbon';

/**
 * Renders an interactive, screen-reader accessible SVG line graph
 * showing historical emissions over the current month.
 */
export function ProgressChart() {
  const { activities } = useCarbon();

  // Group emissions by date
  const chartData = useMemo(() => {
    const dailyMap = {};
    
    // Default base coordinates for standard visual consistency
    // Pre-populate mock dates for the past week if needed, or group current entries
    activities.forEach(act => {
      const day = act.date.slice(8, 10); // Day of month e.g., '01', '03'
      const numDay = parseInt(day, 10);
      if (!isNaN(numDay)) {
        dailyMap[numDay] = (dailyMap[numDay] || 0) + act.emissions;
      }
    });

    // Generate sorted data for the month
    const pointsList = [];
    // Ensure at least some default points if empty
    const daysToRepresent = [1, 5, 10, 15, 20, 25, 30];
    
    daysToRepresent.forEach(day => {
      pointsList.push({
        day,
        emissions: parseFloat((dailyMap[day] || 0).toFixed(1))
      });
    });

    // Add actual logged days that might not be in standard checkpoints
    Object.keys(dailyMap).forEach(k => {
      const d = parseInt(k, 10);
      if (!daysToRepresent.includes(d)) {
        pointsList.push({ day: d, emissions: parseFloat(dailyMap[d].toFixed(1)) });
      }
    });

    pointsList.sort((a, b) => a.day - b.day);

    return pointsList;
  }, [activities]);

  // SVG Chart boundaries
  const width = 500;
  const height = 200;
  const padding = 40;

  const maxEmissions = useMemo(() => {
    const max = Math.max(...chartData.map(d => d.emissions), 50);
    return Math.ceil(max / 50) * 50; // Round up to nearest 50
  }, [chartData]);

  // Compute SVG point coordinates
  const svgPoints = useMemo(() => {
    return chartData.map(d => {
      const x = padding + ((d.day - 1) / 29) * (width - 2 * padding);
      const y = height - padding - (d.emissions / maxEmissions) * (height - 2 * padding);
      return { x, y, day: d.day, emissions: d.emissions };
    });
  }, [chartData, maxEmissions]);

  const polylinePath = useMemo(() => {
    return svgPoints.map(p => `${p.x},${p.y}`).join(' ');
  }, [svgPoints]);

  return (
    <section 
      className="glass-card" 
      style={{ gridColumn: 'span 12' }}
      aria-labelledby="chart-section-title"
    >
      <div className="glass-card-header">
        <h3 id="chart-section-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem' }}>
          Emissions Trajectory
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Current Month Daily Breakdown
        </span>
      </div>

      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Screen Reader Table description of Chart */}
        <div className="sr-only">
          <h4>Emissions Data Table Description</h4>
          <table>
            <thead>
              <tr>
                <th scope="col">Day of Month</th>
                <th scope="col">Emissions (kg CO2e)</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((d, index) => (
                <tr key={index}>
                  <td>Day {d.day}</td>
                  <td>{d.emissions} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Accessible SVG line chart */}
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          width="100%" 
          style={{ overflow: 'visible' }}
          aria-hidden="true" // Hidden because of detailed semantic table descriptions above
        >
          {/* Grids */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = padding + ratio * (height - 2 * padding);
            const val = maxEmissions - ratio * maxEmissions;
            return (
              <g key={index}>
                <line 
                  x1={padding} 
                  y1={y} 
                  x2={width - padding} 
                  y2={y} 
                  stroke="var(--glass-border)" 
                  strokeDasharray="4 4" 
                />
                <text 
                  x={padding - 10} 
                  y={y + 4} 
                  fill="var(--text-muted)" 
                  fontSize="9" 
                  textAnchor="end"
                >
                  {Math.round(val)}
                </text>
              </g>
            );
          })}

          {/* X axis labels */}
          {chartData.map((d, index) => {
            const x = padding + ((d.day - 1) / 29) * (width - 2 * padding);
            // Label every other point to avoid overlap
            if (index % 2 !== 0) return null;
            return (
              <text 
                key={index} 
                x={x} 
                y={height - padding + 15} 
                fill="var(--text-muted)" 
                fontSize="9" 
                textAnchor="middle"
              >
                Day {d.day}
              </text>
            );
          })}

          {/* SVG Line */}
          {svgPoints.length > 1 && (
            <polyline
              fill="none"
              stroke="var(--brand-emerald)"
              strokeWidth="3"
              points={polylinePath}
              style={{
                strokeDasharray: '1000',
                strokeDashoffset: '0',
                transition: 'stroke-dashoffset 2s ease'
              }}
            />
          )}

          {/* Dots on points */}
          {svgPoints.map((p, index) => (
            <g key={index} className="chart-dot-group">
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill="var(--bg-primary)"
                stroke="var(--brand-emerald)"
                strokeWidth="2"
                style={{ cursor: 'pointer' }}
              />
              {/* Tooltip trigger or label */}
              {p.emissions > 0 && (
                <text 
                  x={p.x} 
                  y={p.y - 8} 
                  fill="var(--text-primary)" 
                  fontSize="8" 
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {p.emissions}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}
export default ProgressChart;
