import { useState } from 'react';

export default function StorageData({ onBack, darkMode }) {
  const [cacheSize, setCacheSize] = useState('48.2 MB');
  const [isCleared, setIsCleared] = useState(false);

  // Dynamic Theme Colors
  const bgScreen = darkMode ? '#0b141a' : '#f0f2f5';
  const bgCard = darkMode ? '#202c33' : '#ffffff';
  const textColor = darkMode ? '#e9edef' : '#111111';
  const subText = darkMode ? '#8696a0' : '#667781';
  const borderColor = darkMode ? '#2a3942' : '#e9edef';

  const handleClearCache = () => {
    setCacheSize('0.0 KB');
    setIsCleared(true);
    setTimeout(() => setIsCleared(false), 3000);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: bgScreen, height: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', textAlign: 'left' }}>
      
      {/* WhatsApp Teal Header */}
      <div style={{ backgroundColor: '#075E54', color: 'white', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <span onClick={onBack} style={{ cursor: 'pointer', fontSize: '22px' }}>←</span>
        <div style={{ fontSize: '18px', fontWeight: '600' }}>Storage and Data</div>
      </div>

      {/* Body Content */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px 0' }}>
        
        {/* Storage Usage Summary Card */}
        <div style={{ backgroundColor: bgCard, padding: '20px 16px', borderBottom: `1px solid ${borderColor}`, borderTop: `1px solid ${borderColor}` }}>
          <div style={{ fontSize: '12px', color: '#00A884', fontWeight: 'bold', letterSpacing: '0.5px', marginBottom: '8px' }}>STORAGE USAGE</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '16px', fontWeight: '600', color: textColor }}>Cached Attachments & PDFs</span>
            <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#00A884' }}>{cacheSize}</span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: darkMode ? '#111b21' : '#e9edef', borderRadius: '3px', overflow: 'hidden', marginBottom: '12px' }}>
            <div style={{ width: isCleared ? '2%' : '65%', height: '100%', backgroundColor: '#00A884', transition: 'width 0.3s ease' }}></div>
          </div>
          <div style={{ fontSize: '12px', color: subText }}>
            {isCleared ? 'Cache successfully cleared!' : 'Includes secure PDF previews, voice mail audio, and encrypted email sync logs.'}
          </div>
        </div>

        {/* Network & Download Settings */}
        <div style={{ backgroundColor: bgCard, borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
          
          <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}` }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '500', color: textColor }}>Media Auto-Download</div>
              <div style={{ fontSize: '12px', color: subText }}>Download secure PDF attachments on Wi-Fi</div>
            </div>
            <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: '#00A884', cursor: 'pointer' }} />
          </div>

          <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '500', color: textColor }}>Use Less Data for Calls</div>
              <div style={{ fontSize: '12px', color: subText }}>Optimize IMAP voice gateway bandwidth</div>
            </div>
            <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: '#00A884', cursor: 'pointer' }} />
          </div>

        </div>

        {/* Clear Cache Action Tile */}
        <div style={{ backgroundColor: bgCard, borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}`, marginTop: '8px' }}>
          <div 
            onClick={handleClearCache}
            style={{ padding: '16px', fontSize: '15px', color: '#00A884', fontWeight: '600', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <span>🧹</span>
            <span>Clear IMAP & Document Cache</span>
          </div>
        </div>

      </div>

    </div>
  );
}
