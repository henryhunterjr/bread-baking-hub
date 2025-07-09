import { useState } from 'react';

// Completely inline search test - no external imports except React
const InlineSearchTest = () => {
  const [searchValue, setSearchValue] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-9), `${timestamp}: ${message}`]);
    console.log(`SEARCH TEST: ${message}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    addLog(`Input changed to: "${value}"`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    addLog(`Key pressed: ${e.key}`);
  };

  const handleFocus = () => {
    addLog('Input focused');
  };

  const handleBlur = () => {
    addLog('Input blurred');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Inline Search Functionality Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="test-search" style={{ display: 'block', marginBottom: '8px' }}>
          Test Search Input:
        </label>
        <input
          id="test-search"
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Type something to test..."
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <strong>Current Value:</strong> "{searchValue}"
      </div>

      <div>
        <h3>Event Log:</h3>
        <div 
          style={{ 
            background: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '4px',
            height: '200px',
            overflowY: 'auto',
            fontFamily: 'monospace',
            fontSize: '12px'
          }}
        >
          {logs.length === 0 ? (
            <div style={{ color: '#666' }}>No events logged yet. Try typing in the input above.</div>
          ) : (
            logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))
          )}
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '10px', background: '#e8f5e8', borderRadius: '4px' }}>
        <strong>Test Instructions:</strong>
        <ul>
          <li>Try typing in the search input above</li>
          <li>Check if events are logged in real-time</li>
          <li>Look at the browser console for additional logs</li>
          <li>If no events are logged, the issue is with basic input handling</li>
        </ul>
      </div>
    </div>
  );
};

export default InlineSearchTest;