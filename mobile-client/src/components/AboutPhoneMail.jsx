export default function AboutPhoneMail({ onBack, darkMode }) {
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
        <div style={{ fontSize: '18px', fontWeight: '600' }}>About PhoneMail</div>
      </div>

      {/* Body Content */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
        
        {/* App Branding Card */}
        <div style={{ backgroundColor: bgCard, padding: '24px 16px', borderRadius: '12px', border: `1px solid ${borderColor}`, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#00A884', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
            📱✉️
          </div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: textColor, marginBottom: '4px' }}>
            PhoneMail Client
          </div>
          <div style={{ fontSize: '13px', color: '#00A884', fontWeight: '600', marginBottom: '16px' }}>
            Secure IMAP-to-WhatsApp Messenger v1.0
          </div>
          <div style={{ fontSize: '13px', color: subText, lineHeight: '1.5', maxWidth: '320px' }}>
            Bridging official email gateways (PM-Kisan, High Court, Passport Seva) with end-to-end encrypted messaging infrastructure.
          </div>
        </div>

        {/* Architecture & Security Card */}
        <div style={{ backgroundColor: bgCard, padding: '16px', borderRadius: '12px', border: `1px solid ${borderColor}` }}>
          <div style={{ fontSize: '12px', color: '#00A884', fontWeight: 'bold', letterSpacing: '0.5px', marginBottom: '8px' }}>ARCHITECTURE & SECURITY</div>
          <div style={{ fontSize: '14px', fontWeight: '500', color: textColor, marginBottom: '4px' }}>RSA-2048 Bit Cryptographic Tunnel</div>
          <div style={{ fontSize: '12px', color: subText, lineHeight: '1.4' }}>
            All messages are hashed and signed locally using secure cryptographic keys before routing through the IMAP/SMTP gateway protocol.
          </div>
        </div>

        {/* Buildathon Submission Card */}
        <div style={{ backgroundColor: bgCard, padding: '16px', borderRadius: '12px', border: `1px solid ${borderColor}` }}>
          <div style={{ fontSize: '12px', color: '#00A884', fontWeight: 'bold', letterSpacing: '0.5px', marginBottom: '8px' }}>BUILDATHON SUBMISSION</div>
          <div style={{ fontSize: '13px', color: subText, lineHeight: '1.5' }}>
            Designed and developed for high-fidelity mobile prototyping with full local state persistence, dark mode support, and interactive sub-screens.
          </div>
        </div>

      </div>

    </div>
  );
}
