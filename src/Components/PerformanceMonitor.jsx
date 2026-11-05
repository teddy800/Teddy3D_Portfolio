/**
 * 📊 PERFORMANCE MONITOR COMPONENT
 * Real-time performance metrics display (dev mode only)
 */

import { useState, useEffect, memo } from 'react';
import { getPerformanceMonitor } from '../utils/performanceMonitor';

const PerformanceMonitor = memo(() => {
  const [metrics, setMetrics] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (import.meta.env.MODE !== 'development') return;

    const monitor = getPerformanceMonitor();
    
    // Update metrics every second
    const interval = setInterval(() => {
      const currentMetrics = monitor.getMetrics();
      setMetrics(currentMetrics);
    }, 1000);

    // Keyboard shortcut to toggle visibility (Ctrl+Shift+P)
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  if (!visible || !metrics) return null;

  const getFPSColor = (fps) => {
    if (fps >= 55) return '#10b981'; // Green
    if (fps >= 30) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const getMemoryPercentage = () => {
    if (!metrics.currentMemory) return 0;
    return (metrics.currentMemory.used / metrics.currentMemory.limit) * 100;
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '16px',
        minWidth: '280px',
        fontFamily: '"Fira Code", monospace',
        fontSize: '12px',
        color: '#fff',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
          ⚡ Performance Monitor
        </h3>
        <button
          onClick={() => setVisible(false)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '16px',
            padding: '0',
          }}
        >
          ✕
        </button>
      </div>

      {/* FPS */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ opacity: 0.7 }}>FPS</span>
          <span style={{ color: getFPSColor(metrics.currentFPS), fontWeight: 'bold' }}>
            {metrics.currentFPS}
          </span>
        </div>
        <div style={{ 
          width: '100%', 
          height: '4px', 
          background: 'rgba(255,255,255,0.1)', 
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{ 
            width: `${(metrics.currentFPS / 60) * 100}%`, 
            height: '100%', 
            background: getFPSColor(metrics.currentFPS),
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Average FPS */}
      <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ opacity: 0.7 }}>Avg FPS</span>
        <span>{metrics.avgFPS}</span>
      </div>

      {/* Memory (if available) */}
      {metrics.currentMemory && (
        <>
          <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ opacity: 0.7 }}>Memory</span>
            <span>
              {metrics.currentMemory.used}MB / {metrics.currentMemory.limit}MB
            </span>
          </div>
          <div style={{ 
            width: '100%', 
            height: '4px', 
            background: 'rgba(255,255,255,0.1)', 
            borderRadius: '2px',
            overflow: 'hidden',
            marginBottom: '12px'
          }}>
            <div style={{ 
              width: `${getMemoryPercentage()}%`, 
              height: '100%', 
              background: getMemoryPercentage() > 80 ? '#ef4444' : '#10b981',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </>
      )}

      {/* Web Vitals */}
      {metrics.fcp > 0 && (
        <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ opacity: 0.7 }}>FCP</span>
          <span style={{ color: metrics.fcp < 1800 ? '#10b981' : '#f59e0b' }}>
            {metrics.fcp.toFixed(0)}ms
          </span>
        </div>
      )}
      
      {metrics.lcp > 0 && (
        <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ opacity: 0.7 }}>LCP</span>
          <span style={{ color: metrics.lcp < 2500 ? '#10b981' : '#f59e0b' }}>
            {metrics.lcp.toFixed(0)}ms
          </span>
        </div>
      )}
      
      {metrics.cls > 0 && (
        <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ opacity: 0.7 }}>CLS</span>
          <span style={{ color: metrics.cls < 0.1 ? '#10b981' : '#ef4444' }}>
            {metrics.cls.toFixed(3)}
          </span>
        </div>
      )}

      <div style={{ 
        marginTop: '12px', 
        paddingTop: '12px', 
        borderTop: '1px solid rgba(255,255,255,0.1)',
        fontSize: '10px',
        opacity: 0.5
      }}>
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  );
});

PerformanceMonitor.displayName = 'PerformanceMonitor';

export default PerformanceMonitor;
