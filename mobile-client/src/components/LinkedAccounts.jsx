import { useState } from 'react';

export default function LinkedAccounts({ onBack, darkMode }) {
  const [accounts, setAccounts] = useState([
    { id: 1, email: 'abhishek.nitt@phonemail.com', protocol: 'IMAP / SMTP Secure', status: 'Connected & Synced', default: true },
    { id: 2, email: 'nit.trichy.official@imap.edu', protocol: 'Custom IMAP Gateway', status: 'Sync Paused', default: false }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  // Dynamic Theme Colors
  const bgScreen = darkMode ? '#0b141a' : '#f0f2f5';
  const bgCard = darkMode ? '#202c33' : '#ffffff';
  const textColor = darkMode ? '#e9edef' : '#111111';
  const subText = darkMode ? '#8696a0' : '#667781';
  const borderColor = darkMode ? '#2a3942' : '#e9edef';

  const handleAddAccount = () => {
    if (!newEmail.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    setAccounts([
      ...accounts,
      { id: Date.now(), email: newEmail, protocol: 'IMAP Secure Gateway', status: 'Connected', default: false }
    ]);
    setNewEmail('');
    setShowAddModal(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: bgScreen, height: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      
      {/* WhatsApp Teal Header */}
      <div style={{ backgroundColor: '#075E54', color: 'white', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <span onClick={onBack} style={{ cursor: 'pointer', fontSize: '22px' }}>←</span>
        <div style={{ fontSize: '18px', fontWeight: '600' }}>Linked IMAP Accounts</div>
      </div>

      {/* Body Content */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px 0' }}>
        
        <div style={{ padding: '8px 16px', fontSize: '12px', color: '#00A884', fontWeight: 'bold', letterSpacing: '0.5px' }}>
          ACTIVE EMAIL GATEWAYS
        </div>

        {accounts.map((acc) => (
          <div key={acc.id} style={{ backgroundColor: bgCard, padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', borderBottom: `1px solid ${borderColor}`, borderTop: `1px solid ${borderColor}` }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#00A884', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', fontWeight: 'bold', flexShrink: 0 }}>
              ✉️
            </div>
            <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
              <div style={{ fontSize: '15px', fontWeight: '600', color: textColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {acc.email}
              </div>
              <div style={{ fontSize: '12px', color: subText }}>{acc.protocol} • <span style={{ color: '#00A884', fontWeight: '500' }}>{acc.status}</span></div>
            </div>
          </div>
        ))}

        {/* Add Account Button Tile */}
        <div 
          onClick={() => setShowAddModal(true)}
          style={{ backgroundColor: bgCard, padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}`, marginTop: '8px' }}
        >
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: darkMode ? '#2a3942' : '#e7f5f2', color: '#00A884', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', fontWeight: 'bold', flexShrink: 0 }}>
            ➕
          </div>
          <div style={{ fontSize: '15px', fontWeight: '600', color: '#00A884', textAlign: 'left' }}>
            Link New IMAP / SMTP Account
          </div>
        </div>

      </div>

      {/* Modal for adding new account */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ backgroundColor: bgCard, padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '340px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', textAlign: 'left' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: textColor, marginBottom: '8px' }}>Link Email Gateway</div>
            <div style={{ fontSize: '13px', color: subText, marginBottom: '16px' }}>Enter your email address to establish secure IMAP sync.</div>
            
            <input 
              type="email" 
              placeholder="user@domain.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${borderColor}`, backgroundColor: darkMode ? '#111b21' : '#f8f9fa', color: textColor, outline: 'none', marginBottom: '20px', boxSizing: 'border-box', fontSize: '14px' }}
            />

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ backgroundColor: 'transparent', color: subText, border: 'none', padding: '10px 16px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleAddAccount}
                style={{ backgroundColor: '#00A884', color: '#fff', border: 'none', borderRadius: '20px', padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
