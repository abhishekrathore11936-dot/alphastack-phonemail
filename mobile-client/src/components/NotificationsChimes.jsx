import { useState } from 'react';

export default function NotificationsChimes({ onBack, darkMode }) {
  const [messageSound, setMessageSound] = useState(true);
  const [highPriorityAlerts, setHighPriorityAlerts] = useState(true);
  const [vibrate, setVibrate] = useState(true);

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
        <div style={{ fontSize: '18px', fontWeight: '600' }}>Notifications & Chimes</div>
      </div>

      {/* Body Content */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px 0' }}>
        <div style={{ padding: '8px 16px', fontSize: '12px', color: '#00A884', fontWeight: 'bold', letterSpacing: '0.5px' }}>
          ALERT SETTINGS
        </div>
        <div style={{ backgroundColor: bgCard, borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
          
          <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}` }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '500', color: textColor }}>Message Sounds</div>
              <div style={{ fontSize: '12px', color: subText }}>Play chime for incoming encrypted messages</div>
            </div>
            <input 
              type="checkbox" 
              checked={messageSound} 
              onChange={() => setMessageSound(!messageSound)}
              style={{ width: '18px', height: '18px', accentColor: '#00A884', cursor: 'pointer' }} 
            />
          </div>

          <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}` }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '500', color: textColor }}>High-Priority Alerts</div>
              <div style={{ fontSize: '12px', color: subText }}>Special chime for official gateways (PM-Kisan, Courts)</div>
            </div>
            <input 
              type="checkbox" 
              checked={highPriorityAlerts} 
              onChange={() => setHighPriorityAlerts(!highPriorityAlerts)}
              style={{ width: '18px', height: '18px', accentColor: '#00A884', cursor: 'pointer' }} 
            />
          </div>

          <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '500', color: textColor }}>Vibration</div>
              <div style={{ fontSize: '12px', color: subText }}>Vibrate device upon secure message receipt</div>
            </div>
            <input 
              type="checkbox" 
              checked={vibrate} 
              onChange={() => setVibrate(!vibrate)}
              style={{ width: '18px', height: '18px', accentColor: '#00A884', cursor: 'pointer' }} 
            />
          </div>

        </div>
      </div>

    </div>
  );
}
