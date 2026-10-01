export default function NotificationPermission({ onNext }) {
  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      
      {/* WhatsApp Teal Header */}
      <div style={{ backgroundColor: '#075E54', color: 'white', padding: '18px 16px', fontSize: '18px', fontWeight: '500', display: 'flex', alignItems: 'center' }}>
        Notifications
      </div>

      {/* Body Content */}
      <div style={{ flex: 1, padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>
        
        {/* Notification Icon */}
        <div style={{ width: '80px', height: '80px', backgroundColor: '#e7f5f2', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '24px' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00A884" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </div>

        <h2 style={{ fontSize: '22px', color: '#111', marginBottom: '12px', fontWeight: '600' }}>
          Never miss an email
        </h2>
        <p style={{ fontSize: '14px', color: '#667781', lineHeight: '1.5', marginBottom: '32px' }}>
          Enable notifications to get instant alerts when important messages and chat-based emails arrive in your inbox.
        </p>
      </div>

      {/* Footer Buttons Area */}
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#ffffff', borderTop: '1px solid #f0f2f5' }}>
        <button 
          onClick={onNext}
          style={{ backgroundColor: '#00A884', color: 'white', border: 'none', borderRadius: '24px', padding: '14px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '0.5px' }}
        >
          ENABLE NOTIFICATIONS
        </button>
        <button 
          onClick={onNext}
          style={{ backgroundColor: 'transparent', color: '#667781', border: 'none', padding: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
