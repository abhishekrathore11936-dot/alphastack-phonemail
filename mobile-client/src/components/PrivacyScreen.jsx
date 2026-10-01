import { useState } from 'react';

export default function PrivacyScreen({ onBack, darkMode }) {
  const [readReceipts, setReadReceipts] = useState(true);
  const [rsaEnforced, setRsaEnforced] = useState(true);

  // Dynamic Theme Colors
  const bgScreen = darkMode ? '#0b141a' : '#f0f2f5';
  const bgCard = darkMode ? '#202c33' : '#ffffff';
  const textColor = darkMode ? '#e9edef' : '#111111';
  const subText = darkMode ? '#8696a0' : '#667781';
  const borderColor = darkMode ? '#2a3942' : '#e9edef';

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: bgScreen, height: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', textAlign: 'left' }}>
      
      {/* WhatsApp Teal Header */}
      <div style={{ backgroundColor: '#075E54', color: 'white', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <span onClick={onBack} style={{ cursor: 'pointer', fontSize: '22px' }}>←</span>
        <div style={{ fontSize: '18px', fontWeight: '600' }}>Privacy & Permissions</div>
      </div>

      {/* Body Content */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px 0' }}>
        
        <div style={{ padding: '8px 16px', fontSize: '12px', color: '#00A884', fontWeight: 'bold', letterSpacing: '0.5px' }}>
          MESSAGING & SECURITY CONTROLS
        </div>

        <div style={{ backgroundColor: bgCard, borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
          
          <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}` }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '500', color: textColor }}>Read Receipts</div>
              <div style={{ fontSize: '12px', color: subText }}>If turned off, you won't send or see email read indicators</div>
            </div>
            <input 
              type="checkbox" 
              checked={readReceipts} 
              onChange={() => setReadReceipts(!readReceipts)}
              style={{ width: '18px', height: '18px', accentColor: '#00A884', cursor: 'pointer' }} 
            />
          </div>

          <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '500', color: textColor }}>Strict RSA-2048 Enforcement</div>
              <div style={{ fontSize: '12px', color: subText }}>Automatically reject unencrypted SMTP gateway relay packets</div>
            </div>
            <input 
              type="checkbox" 
              checked={rsaEnforced} 
              onChange={() => setRsaEnforced(!rsaEnforced)}
              style={{ width: '18px', height: '18px', accentColor: '#00A884', cursor: 'pointer' }} 
            />
          </div>

        </div>

        <div style={{ backgroundColor: bgCard, borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}`, marginTop: '8px' }}>
          <div 
            onClick={() => alert('No restricted contacts currently in your block list.')}
            style={{ padding: '16px', fontSize: '15px', color: textColor, fontWeight: '500', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>Blocked Contacts</span>
            <span style={{ color: subText }}>0</span>
          </div>
        </div>

      </div>

    </div>
  );
}
